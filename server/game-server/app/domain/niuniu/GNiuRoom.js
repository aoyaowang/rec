var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var async = require('async');

var Core = require("../../base/Core");
var enums = require("../../consts/enums");
var consts = require("../../consts/consts");
var utils = require("../../util/utils");
var userDao = require("../../dao/userDao");

var GBaseRoom = require('../GBaseRoom');

//创建房间 1 : 20
//抢包     1 : 5

var GNiuRoom = GBaseRoom.extend({
    m_Coin: null,
    m_Num: null,
    m_Owner: null,
    m_RedList: null,

    m_List:null,
    m_bOver:null,

    m_BeginTime:null,
    ctor:function(Type, owner, coin, num)
    {
        GBaseRoom.prototype.ctor.apply(this,arguments);
        this.m_Coin = coin * 100;
        this.m_num = num;
        this.m_Owner = owner;

        this.m_bOver = false;
        this.m_List = {};
        this.m_RedList = utils.getPackets(100, num);

        owner.unlockMoney(c, -1);
        //var c = coin * 20 + 1;
        //owner.unlockMoney(c, -1 * c);
        this.m_Owner._in28Game = true;

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
                    if (key == uid) retdata.data[key] = {data: this.m_Players[key]};
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
            var lm = parseInt(5 * this.m_Coin) / 100;
            if (!user.lockMoney(lm)) return consts.MONEY.MONEY_NOTENOUGH;
        }

        var player = new GNiuPlayer(user);
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

        var n = (l + l2) % 10;
        if (n == 0) n = 10;
        return n;
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
                            var x = this.m_RedList[0] % 100;
                            this.m_RedList[0] -= x;
                            this.m_RedList[1] += x;
                            ind = 0;
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
                            this.m_RedList[0] -= x;
                            this.m_RedList[1] += x;
                            ind = 0;
                        }
                    }


                }
            }
        }

        var px = this.m_RedList[ind];
        var ret = player.Qiang(px);
        if (ret) {
            this.m_List[user.uid] = px;
            this.m_RedList.splice(ind, 1);
            var ot = {};
            for (var key in this.m_List) {
                var p = this.m_Players[key];
                var m = this.m_List[key];
                if (this.m_RedList.length == 0) ot[key] = {data: p};
                else ot[key] = {data: p.Info, m: "xxx", time: p.m_Time};
            }
            player.Info.addMsg(enums.PROTOCOL.GAME_NIUNIU_QIANG, {HallType: this.m_Hall ? this.m_Hall.Type : -1, RoomID:this.m_RoomID, coin: this.m_Coin, num: this.m_num, data: player, other: ot});
            if (player.Info.uid != this.m_Owner.uid)
            this.pushMsg(enums.PROTOCOL.GAME_NIUNIU_OTHERQIANG, {HallType: this.m_Hall ? this.m_Hall.Type : -1, RoomID:this.m_RoomID, user: user});

            if (user.uid != this.m_Owner.uid) {
                var ownerniu = (this.m_Players[this.m_Owner.uid].m_LastNum + this.m_Players[this.m_Owner.uid].m_LastNum2) % 10;
                if (ownerniu == 0) ownerniu = 10;
        
                var peilv = {1: 1, 2: 1, 3: 1, 4: 1,5: 1, 6: 1, 7: 2, 8: 3,9: 4, 10: 5};

                var curniu = (this.m_Players[user.uid].m_LastNum + this.m_Players[user.uid].m_LastNum2) % 10;
                if (curniu == 0) curniu = 10;

                if (ownerniu > curniu || (ownerniu == curniu && this.m_Players[this.m_Owner.uid].m_Qiang >= this.m_Players[user.uid].m_Qiang)) {
                    var lost = peilv[ownerniu];
                    lost = lost * this.m_Coin;
                    ownall+=lost;
                    lost = -1 * lost;
                    this.m_Players[user.uid].m_Pei = lost;
                    var piao =  parseInt(this.m_Players[user.uid].m_Qiang * fl);
                    this.m_Players[user.uid].m_Piao = piao;
                    lost -= piao;
                    lost += this.m_Players[user.uid].m_Qiang;
                    lost = parseInt(lost);
                    //userDao.gamelog(this.m_Players[user.uid].Info.uid, this.m_Hall ? this.m_Hall.Type : -1, "niuniu", parseInt(this.m_Coin), lost / 100, timestamp);
                    this.m_Players[user.uid].Info.unlockMoney(lm, lost / 100);
                    this.m_Players[user.uid].m_Result = lost / 100;
                } else {
                    var win = peilv[curniu];
                    win = win * this.m_Coin;
                    ownall-=win;
                    this.m_Players[user.uid].m_Pei = win;
                    var piao =  parseInt((win + this.m_Players[user.uid].m_Qiang) * fl);
                    this.m_Players[user.uid].m_Piao = piao;
                    win -= piao;
                    win += this.m_Players[user.uid].m_Qiang;
                    win = parseInt(win);
                    //userDao.gamelog(this.m_Players[user.uid].Info.uid, this.m_Hall ? this.m_Hall.Type : -1, "niuniu", parseInt(this.m_Coin), win / 100, timestamp);
                    this.m_Players[user.uid].Info.unlockMoney(lm, win / 100);
                    this.m_Players[user.uid].m_Result = win / 100;
                }
            }

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
        GRobotMgr.Instance().onTimer(this);
    },
    GameOver:function(){
        this.m_Owner._in28Game = false;

        this.m_bOver = true;
        var timestamp = Date.parse(new Date()) / 1000;
        var end = {};

        var left = 0;
        for (var key in this.m_RedList) {
            left += this.m_RedList[key];
        }

        if (!this.m_Players[this.m_Owner.uid]) {
            console.warn("NiuNiu No Owner");
            return;
        }

        var ownerniu = (this.m_Players[this.m_Owner.uid].m_LastNum + this.m_Players[this.m_Owner.uid].m_LastNum2) % 10;
        if (ownerniu == 0) ownerniu = 10;

        var peilv = {1: 1, 2: 1, 3: 1, 4: 1,5: 1, 6: 1, 7: 2, 8: 3,9: 4, 10: 5};

        var lm = parseInt(5 * this.m_Coin) / 100;
        var fl = 0.03;
        var oex = 0;
        var ownall = 0;

        var nochange = true;
        for (var key in this.m_Players) {
            var player = this.m_Players[key];
            if (this.m_Players[key].m_Qiang == 0) continue;
            if (this.m_Players[key].Info.uid == this.m_Owner.uid) continue;
            nochange = false;
            var curniu = (this.m_Players[key].m_LastNum + this.m_Players[key].m_LastNum2) % 10;
            if (curniu == 0) curniu = 10;

            if (ownerniu > curniu || (ownerniu == curniu && this.m_Players[this.m_Owner.uid].m_Qiang >= this.m_Players[key].m_Qiang)) {
                var lost = peilv[ownerniu];
                lost = lost * this.m_Coin;
                ownall+=lost;
                lost = -1 * lost;
                this.m_Players[key].m_Pei = lost;
                var piao =  parseInt(this.m_Players[key].m_Qiang * fl);
                this.m_Players[key].m_Piao = piao;
                lost -= piao;
                lost += this.m_Players[key].m_Qiang;
                lost = parseInt(lost);
                userDao.gamelog(this.m_Players[key].Info.uid, this.m_Hall ? this.m_Hall.Type : -1, "niuniu", parseInt(this.m_Coin), lost / 100, timestamp);
                //this.m_Players[key].Info.unlockMoney(lm, lost / 100);
                this.m_Players[key].m_Result = lost / 100;
            } else {
                var win = peilv[curniu];
                win = win * this.m_Coin;
                ownall-=win;
                this.m_Players[key].m_Pei = win;
                var piao =  parseInt((win + this.m_Players[key].m_Qiang) * fl);
                this.m_Players[key].m_Piao = piao;
                win -= piao;
                win += this.m_Players[key].m_Qiang;
                win = parseInt(win);
                userDao.gamelog(this.m_Players[key].Info.uid, this.m_Hall ? this.m_Hall.Type : -1, "niuniu", parseInt(this.m_Coin), win / 100, timestamp);
                //this.m_Players[key].Info.unlockMoney(lm, win / 100);
                this.m_Players[key].m_Result = win / 100;
            }
        }
        if (nochange) {
            this.m_Players[this.m_Owner.uid].m_Pei = ownall;
            ownall+=this.m_Players[this.m_Owner.uid].m_Qiang;
              
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
    
            userDao.gamelog(this.m_Owner.uid, this.m_Hall ? this.m_Hall.Type : -1, "niuniu", parseInt(this.m_Coin), ownall / 100, timestamp);
            var c = this.m_Coin * 20;
            this.m_Owner.unlockMoney(0, ownall / 100);
            this.m_Players[this.m_Owner.uid].m_Result = ownall / 100;
        } else {
            this.m_Players[this.m_Owner.uid].m_Pei = 0;
            this.m_Players[this.m_Owner.uid].m_Resul = 0;
        }

        
        //this.m_Owner.unlockMoney(0, c / 100);
        //this.m_Owner.unlockMoney(0, left / 100);

        this.pushMsg(enums.PROTOCOL.GAME_NIUNIU_OVER, {roomid: this.m_RoomID, owner: this.m_Owner, data: this.m_Players, over: this.m_RedList.length == 0});

    },
    pushMsg:function(protocol, msg) {
        GBaseRoom.prototype.pushMsg.apply(this,arguments);
    }
});
module.exports = GNiuRoom;

var GNiuPlayer = require('./GNiuPlayer');
var GRobotMgr = require('../GRobotMgr');