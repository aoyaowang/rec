var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var async = require('async');

var Core = require("../../base/Core");
var consts = require("../../consts/consts");
var enums = require("../../consts/enums");
var utils = require("../../util/utils");
var GBaseAI = require("./GBaseAI");
//PARAM格式
/*******************************
{
    1: {nomin: 1, max: 0},
    2: [
        {t: 10, q:{nomin: 1}},
        {t: 2, q:{max: 1}}
    ],
    buqiang: 50s,
    qiang: [
        coin: 10,
        q: 10t,
        t: 2t
    ],
    fa: [
        coin: 10,
        num: 7,
        time: 60s
    ]
}
*/

var GJLAI = GBaseAI.extend({
    ctor:function()
    {
        GBaseAI.prototype.ctor.apply(this,arguments);
    },
    factoryData:function() {
        return {};
    },
    Dispose:function()
    {
        this._super();
    },
    onTimer:function(room) {
        var objKeys = Object.keys(this.m_robots);
        objKeys = objKeys.sort(function(a, b) {
            return utils.GetRandomNum(0, 100) < 50 ? -1 : 1;
        });//这里写所需要的规则
        for(var i=0;i<objKeys.length;i++){
            this.dealRobot(room, this.m_robots[objKeys[i]]);
        }
    },
    dealRobot:function(room, robot) {
        if (!this.inTime(robot.time1) && !this.inTime(robot.time2) && !this.inTime(robot.time3)) return;

        try{
            var param = JSON.parse(robot.param);
        } catch(e) {
            return;
        }
        var timestamp = Date.parse(new Date()) / 1000;

        if (!!param['buqiang'] && (!robot.run || !robot.run.roomids || !robot.run.roomids[room.m_RoomID])) {
            var t = parseInt(param['buqiang']);
            var bucoin = parseInt(param['buqiangcoin']) || -1;
            if (bucoin == -1 || bucoin * 100 == room.m_Coin) {
                if (timestamp - room.m_BeginTime > t) {
                    var qiangtype = {};
                    if (!!param['1']) {
                        var nozuixiao = param['1']['nomin'] || false;
                        var zuida = param['1']['max'] || false;
                        if (nozuixiao) qiangtype['nomin'] = 1;
                        if (zuida) qiangtype['max'] = 1;
                    }
                    else if (param['2']) {
                        var ay = param['2'];
                        if (!robot.run) robot.run = {};
                        if (!robot.run.qiang) robot.run.qiang = {a: -1, t: 0};
                        if (!robot.run.roomids) robot.run.roomids = {};
                        if (ay.length - 1 == robot.run.qiang.a) {
                            if (!ay[robot.run.qiang.a]) robot.run.qiang = {a: -1, t:0};
                            if (robot.run.qiang.t >= ay[robot.run.qiang.a].t) robot.run.qiang = {a:-1, t:0};
                        }
                        var curt = null;
                        for (var key in ay) {
                            var a = ay[key];
                            if (robot.run.qiang.a >= key) continue;
                            if (robot.run.qiang.a != -1) {
                                if (!ay[robot.run.qiang.a]) robot.run.qiang = {a: -1, t:0, roomid: -1};
                                if (robot.run.qiang.t >= ay[robot.run.qiang.a].t) robot.run.qiang = {a:-1, t:0, roomid: -1};
        
                                if (robot.run.roomids[room.m_RoomID]) {
                                    continue;
                                }
        
                                if (robot.run.qiang.a == -1) {
                                    robot.run.roomids[room.m_RoomID] = 1;
                                    robot.run.qiang.a = key;
                                    robot.run.qiang.t++;
                                    curt = a;
                                    break;
                                } else {
                                    robot.run.qiang.t++;
                                    curt = ay[robot.run.qiang.a];
                                    break;
                                }
                            } else {
                                robot.run.roomids[room.m_RoomID] = 1;
                                robot.run.qiang.a = key;
                                robot.run.qiang.t++;
                                curt = a;
                                break;
                            }
                        }
                        if (!!curt) {
                            qiangtype[curt.q] = 1;
                        }
                    }
    
                    Core.GData.checkUid(robot.uid, function(err, user){
                        if (!user) return;
                        console.warn("N:" + user.nickname + "Q:" + JSON.stringify(qiangtype) + " " + room.CheckQiang(qiangtype))
                        if (!room.CheckQiang(qiangtype)) return;
                        if (room.playerEnter(user) == consts.NOR_CODE.SUC_OK) {
                            room.PlayerQiang(user, qiangtype);
                        }
                    }.bind(this));
                }
            }
        }

        if (!!param['qiang'] && 
            (!robot.run || !robot.run.roomids || !robot.run.roomids[room.m_RoomID]) && 
            utils.GetRandomNum(3, 10) <= timestamp - room.m_BeginTime) {
            var qays = param['qiang'];
            for (var qi in qays) {
                var qay = qays[qi];
                if (room.m_Coin != qay.coin * 100) continue;
                if (!robot.run) robot.run = {};
                if (!robot.run.qiangtime) robot.run.qiangtime = {q: -1, t: 0};
                if (!robot.run.roomids) robot.run.roomids = {};
    
                if (robot.run.qiangtime.q == -1) {
                    robot.run.qiangtime = {q: 1, t: 0};
                } else {
                    if (robot.run.qiangtime.q == 1) {
                        if (robot.run.qiangtime.t >= qay.q) robot.run.qiangtime = {q: 0, t: 0};
                    } else {
                        if (robot.run.qiangtime.t >= qay.t) robot.run.qiangtime = {q: 1, t: 0};
                    }
                }
                robot.run.qiangtime.t++;
    
                robot.run.roomids[room.m_RoomID] = 1;
    
                var qiangtype = {};
                if (!!param['1']) {
                    var nozuixiao = param['1']['nomin'] || false;
                    var zuida = param['1']['max'] || false;
                    if (nozuixiao) qiangtype['nomin'] = 1;
                    if (zuida) qiangtype['max'] = 1;
                }
                else if (param['2']) {
                    var ay = param['2'];
                    if (!robot.run) robot.run = {};
                    if (!robot.run.qiang) robot.run.qiang = {a: -1, t: 0, roomid: -1};
                    if (ay.length - 1 == robot.run.qiang.a) {
                        if (!ay[robot.run.qiang.a]) robot.run.qiang = {a: -1, t:0, roomid: -1};
                        if (robot.run.qiang.t >= ay[robot.run.qiang.a].t) robot.run.qiang = {a:-1, t:0, roomid: -1};
                    }
                    var curt = null;
                    for (var key in ay) {
                        var a = ay[key];
                        if (robot.run.qiang.a >= key) continue;
                        if (robot.run.qiang.a != -1) {
                            if (!ay[robot.run.qiang.a]) robot.run.qiang = {a: -1, t:0};
                            if (robot.run.qiang.t >= ay[robot.run.qiang.a].t) robot.run.qiang = {a:-1, t:0};
    
                            if (robot.run.qiang.a == -1) {
                                robot.run.qiang.a = key;
                                robot.run.qiang.t++;
                                curt = a;
                                break;
                            } else {
                                robot.run.qiang.t++;
                                curt = ay[robot.run.qiang.a];
                                break;
                            }
                        } else {
                            robot.run.qiang.a = key;
                            robot.run.qiang.t++;
                            curt = a;
                            break;
                        }
                    }
                    if (!!curt) {
                        qiangtype = curt.q;
                    }
                }
    
                Core.GData.checkUid(robot.uid, function(err, user){
                    if (!user) return;
                    
                    logger.warn("CheckBot" + JSON.stringify(qiangtype) + "  " + room.CheckQiang(qiangtype));
                    if (!room.CheckQiang(qiangtype)) return;
                    if (room.playerEnter(user) == consts.NOR_CODE.SUC_OK) {
                        room.PlayerQiang(user, qiangtype);
                    }
                }.bind(this));
            }
        }

        if (!!param['fa']) {
            var ay = param['fa'];
            for (var key in ay) {
                var a = ay[key];
                if (!robot.run) robot.run = {};
                if (!robot.run.fa) robot.run.fa = {};
                if (room.m_Coin == a.coin * 100) {
                    var max = room.m_BeginTime + a.time;
                    if (max > robot.run.fa[a.coin + ":" + a.num])
                        robot.run.fa[a.coin + ":" + a.num] = max;
                }
            }
        }
    },
    TimerFunc:function(delta) {
        var objKeys = Object.keys(this.m_robots);
        objKeys = objKeys.sort(function(a, b) {
            return utils.GetRandomNum(0, 100) < 50 ? -1 : 1;
        });//这里写所需要的规则
        for(var i=0;i<objKeys.length;i++){
            this.dealFa(this.m_robots[objKeys[i]], delta);
        }
    },
    dealFa:function(robot, delta) {
        return;
        if (!this.inTime(robot.time1) && !this.inTime(robot.time2) && !this.inTime(robot.time3)) return;

        try{
            var param = JSON.parse(robot.param);
        } catch(e) {
            return;
        }
        var timestamp = Date.parse(new Date()) / 1000;

        if (!!param['fa']) {
            var ay = param['fa'];
            for (var key in ay) {
                var a = ay[key];
                if (!robot.run) robot.run = {};
                if (!robot.run.fa) robot.run.fa = {};
                if (!robot.run.fa[a.coin + ":" + a.num]) robot.run.fa[a.coin + ":" + a.num] = -1;
                
                if (robot.run.fa[a.coin + ":" + a.num] != -1 && timestamp > robot.run.fa[a.coin + ":" + a.num]/* > a.time*/) {
                    robot.run.fa[a.coin + ":" + a.num] = -1;

                    Core.GData.checkUid(robot.uid, function(x,err, user){
                        if (!user) return;
                        var coin = parseInt(x.coin);
                        console.warn("发包" + a.coin);
                        if (coin == null || !this.jielongCheck(coin)) {
                            console.warn("发包！！！" + a.coin);
                            return;
                        }
            
                        if (!!Core.GData.m_hall[1].m_CurRoom[coin]) {
                            console.warn("发包！！！!!!" + a.coin);
                            return;
                        }
            
                        for (var key in this.m_robots) {
                            if (!!this.m_robots[key].run && !!this.m_robots[key].run.fa && !!this.m_robots[key].run.fa[x.coin + ":" + x.num]) 
                                this.m_robots[key].run.fa[x.coin + ":" + x.num] = 0;
                        }

                        var room2 = new GJLRoom(coin, user, coin, 5, true);
                        Core.GData.m_hall[1].createRoom(room2);
                        Core.GData.m_hall[1].m_CurRoom[coin] = room2;
                        room2.pushMsg(enums.PROTOCOL.GAME_JIELONG_CREATE, {data: room2});

                        this.onTimer(room2);
                    }.bind(this,a));
                }
            }
        }
    },
    jielongCheck:function(coin) {
        var STYPE = {
            3: 5,
            5: 5,
            10: 5,
            20: 5,
            30: 5,
            50: 5,
            100: 5,
            200: 5,
            300: 5,
            500: 5
        };
    
        if (!!STYPE[coin]) return true;
        else return false; 
    }
}).Static({    
    __I:null,
    Instance: function() {
        if (!this.__I) {
            this.__I = new GJLAI();
            this.__I.Init();
        }
        return this.__I;
    }
});
module.exports = GJLAI;

var GJLRoom =require('../jielong/GJLRoom');