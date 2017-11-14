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

        if (!user.lockMoney(1)) return consts.MONEY.MONEY_NOTENOUGH;

        var player = new G28Player(user);
        this.m_Players[player.uid] = player;
        this.m_PlayerCount = utils.size(this.m_Players);
        player.m_Room = this;
        player.m_Position = this.m_PlayerCount;
        player.m_EnterTime = Date.parse(new Date()) / 1000;
        player.Info.inGame.push(this);



        this.updatePos();

        return consts.NOR_CODE.SUC_OK;
    },
    GetNiuType:function(v) {
        var l = v % 10;
        var l2 = parseInt((v % 100 - l) / 10);

        if (l == -1 || l2 == -1) return -1;
        
        var ret = 100;
        if (l == l2) {
            ret += 100 * l;
        }
        else if ((l == 2 && l2 == 8) || (l2 == 2 && l == 8))
        {
            ret = 100;   
        }
        else {
            ret = (l + l2) % 10 * 10 + Math.max(l, l2);
        }
        return ret;
    },
    PlayerQiang:function(user, qiangtype) {
        var player = this.m_Players[user.uid];
        if (!player || this.m_RedList.length == 0) {
            return false;
        }
        var ind = 0;
        if (!!qiangtype) {
            if (qiangtype['allwin']) {
                var max = 0;
                for (var key in this.m_RedList) {
                    var tt = this.GetNiuType(this.m_RedList[key]);
                    if (tt > max) {
                        max = tt;
                        ind = key;
                    }
                }
            }
            if (qiangtype['alllose']) {
                var min = 999999999999999999999;
                for (var key in this.m_RedList) {
                    var tt = this.GetNiuType(this.m_RedList[key]);
                    if (tt < min) {
                        min = tt;
                        ind = key;
                    }
                }
            }
            if (qiangtype['ctwin'] && qiangtype['ctlose']) {
                var ay = [];
                for (var key in this.m_RedList) {
                    ay.push(this.GetNiuType(this.m_RedList[key]));
                }

                ay.sort(function(a,b){
                    return a - b;
                });
                
                if (ay.length > qiangtype['ctlose']) {
                    for (var key in this.m_RedList) {
                        if (this.GetNiuType(this.m_RedList[key]) == qiangtype['ctlose']) {
                            ind = key;
                            break;
                        }
                    }
                }
            }

            if (qiangtype['win'] || qiangtype['lose']) {
                if (!!this.m_Players[this.m_Owner.uid]) {
                    var niu = this.GetNiuType(this.m_Players[this.m_Owner.uid].m_Qiang);

                    if (qiangtype['win']) {
                        var bFind = false;
                        for (var key in this.m_RedList) {
                            if (this.GetNiuType(this.m_RedList[key]) > niu) {
                                ind = key;
                                bFind = true;
                                break;
                            }
                        }

                        if (!bFind && this.m_RedList.length > 1) {
                            var x = (this.m_RedList[0] % 100) - 19;
                            if (this.m_RedList[0] > 19) {
                                this.m_RedList[0] -= x;
                                this.m_RedList[1] += x;
                                ind = 0;
                            }

                        }
                    }
                    else if (qiangtype['lose']) {
                        var bFind = false;
                        for (var key in this.m_RedList) {
                            if (this.GetNiuType(this.m_RedList[key]) < niu) {
                                ind = key;
                                bFind = true;
                                break;
                            }
                        }

                        if (!bFind && this.m_RedList.length > 1) {
                            var x = (this.m_RedList[0] % 100) - 1;
                            if (this.m_RedList[0] > 1) {
                                this.m_RedList[0] -= x;
                                this.m_RedList[1] += x;
                                ind = 0;
                            }
                        }
                    }


                }
            }
        }

        var p = this.m_RedList[ind];
        var ret = player.Qiang(p);
        if (ret) {
            this.m_List[user.uid] = p;
            this.m_RedList.splice(ind, 1);
            var ot = {};
            for (var key in this.m_List) {
                var p = this.m_Players[key];
                var m = this.m_List[key];
                if (this.m_RedList.length == 0) ot[key] = {data: p};
                else ot[key] = {data: p.Info, m: "xxx", time: p.m_Time};
            }
            player.Info.addMsg(enums.PROTOCOL.GAME_28_QIANG, {HallType: this.m_Hall ? this.m_Hall.Type : -1, RoomID:this.m_RoomID, coin: this.m_Coin, num: this.m_num, data: p, other: ot});
            
            if (player.Info.uid != this.m_Owner.uid)
            this.pushMsg(enums.PROTOCOL.GAME_28_OTHERQIANG, {HallType: this.m_Hall ? this.m_Hall.Type : -1, RoomID:this.m_RoomID, user: user});
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
        GRobotMgr.Instance().onTimer(this);
    },
    GameOver:function(){
        this.m_bOver = true;
        var timestamp = Date.parse(new Date()) / 1000;
        var end = {};

        var left = 0;
        for (var key in this.m_RedList) {
            left += this.m_RedList[key];
        }

        if (!this.m_Players[this.m_Owner.uid]) {
            console.warn("28 No Owner");
            return;
        }

        var ownerniu = this.m_Players[this.m_Owner.uid].CardType();

        var lm = parseInt(3 * this.m_Coin) / 100;
        var fl = 0.03;
        var oex = 0;
        var ownall = 0;
        for (var key in this.m_Players) {
            var player = this.m_Players[key];
            if (this.m_Players[key].m_Qiang == 0) continue;
            if (this.m_Players[key].Info.uid == this.m_Owner.uid) continue;
            var curniu = this.m_Players[key].CardType();

            if (ownerniu > curniu) {
                var lost = 1;
                lost = lost * this.m_Coin;
                ownall+=lost;
                lost = -1 * lost;
                this.m_Players[key].m_Pei = lost - 100;
                var piao =  parseInt(this.m_Players[key].m_Qiang * fl);
                this.m_Players[key].m_Piao = piao;
                lost -= piao;
                lost = parseInt(lost);
                userDao.gamelog(this.m_Players[key].Info.uid, this.m_Hall ? this.m_Hall.Type : -1, "28", parseInt(this.m_Coin), lost / 100, timestamp);
                this.m_Players[key].Info.unlockMoney(lm, lost / 100);
                this.m_Players[key].m_Result = lost / 100 - 1;
            } else {
                var win = 1;
                win = win * this.m_Coin;
                ownall-=win;
                this.m_Players[key].m_Pei = win - 100;
                var piao =  parseInt((win + this.m_Players[key].m_Qiang) * fl);
                this.m_Players[key].m_Piao = piao;
                win -= piao;
                win = parseInt(win);
                userDao.gamelog(this.m_Players[key].Info.uid, this.m_Hall ? this.m_Hall.Type : -1, "28", parseInt(this.m_Coin), win / 100, timestamp);
                this.m_Players[key].Info.unlockMoney(lm, win / 100);
                this.m_Players[key].m_Result = win / 100 - 1;
            }
        }
        
        ownall+=this.m_Players[this.m_Owner.uid].m_Qiang;
        this.m_Players[this.m_Owner.uid].m_Pei = ownall + 1;
        if (ownall > 0) {
            var ppp = ownall * fl;
            ownall -= ppp;
            this.m_Players[this.m_Owner.uid].m_Piao = ppp;
        } else {
            var ppp = this.m_Players[this.m_Owner.uid].m_Qiang * fl;
            ownall -= ppp;
            this.m_Players[this.m_Owner.uid].m_Piao = ppp;
        }
        ownall-=1;
        ownall = parseInt(ownall);

        userDao.gamelog(this.m_Owner.uid, this.m_Hall ? this.m_Hall.Type : -1, "28", parseInt(this.m_Coin), ownall / 100, timestamp);
        var c = this.m_Coin * 20 + 1;
        this.m_Owner.unlockMoney(0, ownall / 100);
        this.m_Players[this.m_Owner.uid].m_Result = ownall / 100 - 1;

        this.m_Owner.unlockMoney(0, left / 100);

        this.pushMsg(enums.PROTOCOL.GAME_28_OVER, {roomid: this.m_RoomID, owner: this.m_Owner, data: this.m_Players, over: this.m_RedList.length == 0});

        
    }
});
module.exports = G28Room;

var G28Player = require('./G28Player');
var GRobotMgr = require('../GRobotMgr');