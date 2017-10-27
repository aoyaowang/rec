var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var async = require('async');

var Core = require("../../base/Core");
var enums = require("../../consts/enums");
var consts = require("../../consts/consts");
var utils = require("../../util/utils");
var userDao = require("../../dao/userDao");

var GBaseRoom = require('../GBaseRoom');

var G28Room = GBaseRoom.extend({
    m_Coin: null,
    m_Owner: null,
    m_RedList: null,

    m_List:null,
    m_bOver:null,

    m_BeginTime:null,
    ctor:function(Type, owner, coin)
    {
        GBaseRoom.prototype.ctor.apply(this,arguments);
        this.m_Coin = coin * 100;
        this.m_Owner = owner;

        this.m_bOver = false;
        this.m_List = {};
        this.m_RedList = utils.getPackets(400, 4, null);
        
        var c = coin * 3 + 1;
        owner.unlockMoney(c, -1 * c);

        this.playerEnter(owner);
        this.playerQiang(owner);

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
        return {HallType: this.m_Hall ? this.m_Hall.Type : -1, RoomID:this.m_RoomID,Type: this.Type, coin: this.m_Coin / 100, num: this.m_num, owner: this.m_Owner, over: this.m_RedList.length == 0};
    },
    detail:function(uid)
    {
        var retdata = {roomid: this.m_RoomID, coin: this.m_Coin, num: this.m_num, owner: this.m_Owner};
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

        if (!player.Info.lockMoney(1)) return consts.MONEY.MONEY_NOTENOUGH;

        var player = new GJLPlayer(user);
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
            player.Info.addMsg(enums.PROTOCOL.GAME_28_QIANG, {HallType: this.m_Hall ? this.m_Hall.Type : -1, RoomID:this.m_RoomID, coin: this.m_Coin, num: this.m_num, data: p, other: ot});
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

        if (timestamp - this.m_BeginTime > 60) {
            this.GameOver();
        }
    },
    GameOver:function(){
        this.m_bOver = true;
        var timestamp = Date.parse(new Date()) / 1000;

        
    }
});
module.exports = G28Room;

var G28Player = require('./G28Player');