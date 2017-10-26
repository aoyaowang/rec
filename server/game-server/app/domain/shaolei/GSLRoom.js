var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var async = require('async');

var Core = require("../../base/Core");
var enums = require("../../consts/enums");
var consts = require("../../consts/consts");
var utils = require("../../util/utils");
var userDao = require("../../dao/userDao");

var GBaseRoom = require('../GBaseRoom');

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

        //this.PlayerEnter(owner);
        this.m_BeginTime = Date.parse(new Date()) / 1000;
        var tick = pomelo.app.get('tickManager');
        tick.addTick(this.CheckTimer,this,1,1);
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
        return {HallType: this.m_Hall ? this.m_Hall.Type : -1, RoomID:this.m_RoomID,Type: this.Type, coin: this.m_Coin / 100, num: this.m_num, bomb: this.m_Bomb, owner: this.m_Owner, over: this.m_RedList.length == 0};
    },
    detail:function(uid)
    {
        var retdata = {roomid: this.m_RoomID, coin: this.m_Coin, num: this.m_num, bomb: this.m_Bomb, owner: this.m_Owner};
        if (!!uid) {
            retdata.data = {};
            if (!this.m_bOver) {
                for (var key in this.m_Players) {
                    retdata.data[key] = {data: this.m_Players[key], m: "xxx", time: this.m_Players[key].m_Time};
                    if (key == uid) retdata.data[key].m = this.m_Players[key].m_Qiang;
                }
            } else {
                for (var key in this.m_Players) {
                    retdata.data[key] = {data: this.m_Players[key]};
                }    
            }
        } else {
            retdata.data = {};
            if (!this.m_bOver)
            {
                for (var key in this.m_Players) {
                    retdata.data[key] = {data: this.m_Players[key], m: "xxx", time: this.m_Players[key].m_Time};
                }    
            } else {
                for (var key in this.m_Players) {
                    retdata.data[key] = {data: this.m_Players[key]};
                }    
            }
        }

        return retdata;
    },
    playerEnter:function(user) {
        if (this.m_PlayerCount >= this.m_num) return consts.ROOM.ROOM_FULL;

        if (this.m_Players[user.uid]) return consts.NOR_CODE.FAILED;

        if (user.uid != this.m_Owner.uid) {
            var lm = parseInt(1 * this.m_Coin) / 100;
            if (this.m_num == 7) lm = parseInt(1.5 * this.m_Coin / 100);
            if (!player.Info.lockMoney(lm)) return consts.MONEY.MONEY_NOTENOUGH;
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
    PlayerQiang:function(user) {
        var player = this.m_Players[user.uid];
        if (!player || this.m_RedList.length == 0) {
            return false;
        }
        var p = this.m_RedList[0];
        var ret = player.Qiang(p);
        if (ret) {
            this.m_List[user.uid] = p;
            this.m_RedList.splice(0, 1);
            var ot = {};
            for (var key in this.m_List) {
                var p = this.m_Players[key];
                var m = this.m_List[key];
                if (this.m_RedList.length == 0) ot[key] = {data: p};
                else ot[key] = {data: p.Info, m: "xxx", time: p.m_Time};
            }
            player.Info.addMsg(enums.PROTOCOL.GAME_SHAOLEI_QIANG, {HallType: this.m_Hall ? this.m_Hall.Type : -1, RoomID:this.m_RoomID, coin: this.m_Coin, num: this.m_num, bomb: this.Bomb, data: p, other: ot});
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
        tick.addTick(this.CheckTimer,this,1,1);

        var timestamp = Date.parse(new Date()) / 1000;
        // for (var key in this.m_Players) {
        //     if (this.m_Players[key].m_Qiang == 0 && timestamp - this.m_Players.m_EnterTime >= 30) {
        //         this.PlayerQiang(this.m_Players[key].Info);
        //     }
        // }

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

        var lm = parseInt(1 * this.m_Coin) / 100;
        var peilv = 1.0;
        if (this.m_num == 7) {
            lm = parseInt(1.5 * this.m_Coin) / 100;
            peilv = 1.5;
        }
        var fl = 0.03;
        var oex = 0;
        var ownall = 0;
        for (var key in this.m_Players) {
            var player = this.m_Players[key];
            if (this.m_Players[key].m_Qiang == 0) continue;
            var l = Math.floor(player.m_Qiang * fl);
            if (l < 1) l = 0;
            var e = player.m_Qiang - l;
            if (player.m_LastNum == this.m_Bomb && player.Info.uid != this.m_Owner.uid) {
                e -= lm * 100;
                oex += lm;
            }
            e = parseInt(e);
            console.warn("GAMEOVER:" + player.Info.uid);
            player.Info.unlockMoney(lm, e / 100);
            player.m_Result = e / 100;
            ownall = e / 100;
            if (player.Info.uid != this.m_Owner.uid)
                userDao.gamelog(player.Info.uid, this.m_Hall ? this.m_Hall.Type : -1, this.m_Coin, e, timestamp);
        }

        userDao.gamelog(this.m_Owner.uid, this.m_Hall ? this.m_Hall.Type : -1, "saolei", parseInt(this.m_Coin), parseInt((ownall + oex + left) * 100) - this.m_Coin, timestamp);
        if (this.m_Players[this.m_Owner.uid] )
        this.m_Owner.unlockMoney(0, oex);

        this.pushMsg(enums.PROTOCOL.GAME_SHAOLEI_OVER, {roomid: this.m_RoomID, owner: this.m_Owner, data: this.m_Players, over: this.m_RedList.length == 0, bomb: this.m_Bomb});

    },
    pushMsg:function(protocol, msg) {
        GBaseRoom.prototype.pushMsg.apply(this,arguments);
    }
});
module.exports = GSLRoom;

var GSLPlayer = require('./GSLPlayer');