var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var async = require('async');

var Core = require("../base/Core");
var enums = require("../consts/enums");
var consts = require("../consts/consts");
var utils = require("../util/utils");
var userDao = require("../dao/userDao");

var GSLRoom = GBaseRoom.extend({
    m_Coin: null,
    m_Num: null,
    m_Bomb: null,
    m_Owner: null,
    m_RedList: null,

    m_List:null,
    m_bOver:null,

    m_BeginTime:null,
    ctor:function(Type, owner, coin, num, bomb, mustBomb)
    {
        GBaseRoom.prototype.ctor.apply(this,arguments);
        this.m_Coin = coin * 100;
        this.m_num = num;
        this.m_Bomb = bomb;
        this.m_Owner = owner;

        this.m_bOver = false;
        this.m_List = {};
        this.m_RedList = utils.getPackets(this.m_Coin, num, !!mustBomb ? bomb : null);
        
        
        owner.unlockMoney(coin, -1 * coin);
        owner.unlockFangka(1, -1);

        this.PlayerEnter(owner);
        this.m_BeginTime = Date.parse(new Date()) / 1000;
        var tick = pomelo.app.get('tickManager');
        tick.addTick(this.CheckTimer,this,1000,1);
    },
    factoryData:function() {
        return {};
    },
    Dispose:function()
    {
        GBaseRoom.prototype.Dispose.apply(this,arguments);
    },
    toJSON:function()
    {
        return {HallType: this.m_Hall ? this.m_Hall.Type : -1, RoomID:this.m_RoomID,Type: this.Type, Playes: this.m_Players};
    },
    playerEnter:function(user) {
        if (this.m_PlayerCount >= this.m_Num) return consts.ROOM.ROOM_FULL;

        if (user.uid != this.m_Owner.uid) {
            var lm = parseInt(1 * this.m_Coin / 100);
            if (this.m_Num == 7) lm = parseInt(1.5 * this.m_Coin / 100);
            if (!player.Info.lockMoney(lm)) return consts.MONEY.MONEY_NOTENOUGH;
        }


        for (var key in this.m_Players) {
            this.m_Players[key].addMsg(enums.PROTOCOL.PLAYER_ENTER, {HallType: this.m_Hall ? this.m_Hall.Type : -1, RoomID:this.m_RoomID, data: user.ShowData()})
        }        
        var player = new GSLPlayer(user);
        this.m_Players[player.uid] = player;
        this.m_PlayerCount = utils.size(this.m_Players);
        player.m_Room = this;
        player.m_Position = this.m_PlayerCount;
        player.m_EnterTime = Date.parse(new Date()) / 1000;
        player.Info.inGame.push(this);



        this.updatePos();

        return consts.NOR_CODE.SUC_OK;
    },
    playerleave:function(user) {
        for (var key in this.m_Players) {
            this.m_Players[key].addMsg(enums.PROTOCOL.PLAYER_LEAVE, {HallType: this.m_Hall ? this.m_Hall.Type : -1, RoomID:this.m_RoomID,data: user.ShowData()});
        }
        var player = this.m_Players[user.uid];
        delete this.m_Players[user.uid];
        if (player) {
            player.m_Room = null;
            player.m_Position = null;
            for (var key in player.Info.inGame) {
                if (player.Info.inGame[key] == this) {
                    player.Info.inGame.splice(key, 1);
                    break;
                }
            }
        }
        this.m_PlayerCount = utils.size(this.m_Players);

        this.updatePos();
    },
    PlayerQiang:function(user) {
        var player = this.m_Players[user.uid];
        if (!player || this.m_RedList.length == 0) return false;
        var p = this.m_RedList[0];
        var ret = player.Qiang(p);
        if (ret) {
            this.m_List[user.uid] = p;
            this.m_RedList.splice(0, 1);
            player.Info.addMsg(enums.PROTOCOL.GAME_SHAOLEI_QIANG, {HallType: this.m_Hall ? this.m_Hall.Type : -1, RoomID:this.m_RoomID, data: p});
            if (this.m_RedList.length == 0) {
                this.GameOver();
            }
            return true;
        } else {
            return false;
        }
    },
    CheckTimer:function(){
        if (this.m_bOver) return;
        var tick = pomelo.app.get('tickManager');
        tick.addTick(this.CheckTimer,this,1000,1);

        var timestamp = Date.parse(new Date()) / 1000;
        for (var key in this.m_Players) {
            if (this.m_Players[key].m_Qiang == 0 && timestamp - this.m_Players.m_EnterTime >= 30) {
                this.PlayerQiang(this.m_Players[key].Info);
            }
        }

        if (timestamp - this.m_BeginTime >= 60) {
            this.GameOver();
        }
    },
    GameOver:function(){
        this.m_bOver = true;
        var timestamp = Date.parse(new Date()) / 1000;
        var end = {};

        var left = 0;
        for (var key in this.m_RedList) {
            left += this.m_RedList[key];
        }

        this.m_Owner.unlockMoney(0, left / 100);

        var lm = parseInt(1 * this.m_Coin / 100);
        var peilv = 1.0;
        if (this.m_Num == 7) {
            lm = parseInt(1.5 * this.m_Coin / 100);
            peilv = 1.5;
        }
        var fl = 0.03;
        var oex = 0;
        var ownall = 0;
        for (var key in this.m_Players) {
            var player = this.m_Players[key];
            if (this.m_Players[key].m_Qiang == 0) continue;
            var l = Math.floor(player.m_Qiang * fl);
            var e = player.m_Qiang - l;
            if (player.m_LastNum == this.m_Bomb && player.Info.uid != this.m_Owner.uid) {
                e -= lm * 100;
                oex += lm;
            }
            e = parseInt(e);
            player.Info.unlockMoney(lm, e / 100);
            ownall = e / 100;
            if (player.Info.uid != this.m_Owner.uid)
                userDao.gamelog(player.Info.uid, this.m_Hall ? this.m_Hall.Type : -1, this.m_Coin, e, timestamp);
        }

        userDao.gamelog(this.m_Owner.uid, this.m_Hall ? this.m_Hall.Type : -1, this.m_Coin, ownall + oex + left - this.m_Coin, timestamp);
        this.m_Owner.unlockMoney(0, oex);

    }
});
module.exports = GSLRoom;

var GBaseRoom = require('../GBaseRoom');
var GSLPlayer = require('./GSLPlayer');