var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var async = require('async');

var Core = require("../../base/Core");
var consts = require("../../consts/consts");
var enums = require("../../consts/enums");
var utils = require("../../util/utils");
var GBaseAI = require("./GBaseAI");
var GNiuAI = GBaseAI.extend({
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
        if (!robot.run) robot.run = {};
        if (!robot.run.rooms) robot.run.rooms = {};
        if (!robot.run.qiangcfg) robot.run.qiangcfg = {t:0, win: 0, lose: 0};

        if (!!param['buqiang']) {
            var t = parseInt(param['buqiang']);
            if (timestamp - room.m_BeginTime > t && !robot.run.rooms[room.m_RoomID]) {
                
                Core.GData.checkUid(robot.uid, function(err, user){
                    if (!user) return;
                    if (room.playerEnter(user) == consts.NOR_CODE.SUC_OK) {
                        room.PlayerQiang(user, mustqiang);
                        robot.run.rooms[room.m_RoomID] = 1;
                    }
                }.bind(this));
            }
        }


        if (!!param['qiang']) {
            var ay = param['qiang'];
            for (var key in ay) {
                var a = ay[key];
                if (room.m_Coin == a.coin * 100) {
                    if (!robot.run) robot.run = {};
                    if (!robot.run.qiang) robot.run.qiang = {};
                    if (!robot.run.qiang[a.coin]) robot.run.qiang[a.coin] = {q: {}, t: {}};
                    if (utils.size(robot.run.qiang[a.coin].t) >= a.t) {
                        robot.run.qiang[a.coin] = {q: {}, t: {}};
                    }
                    if (utils.size(robot.run.qiang[a.coin].q) >= a.q) {
                        if (!!robot.run.qiang[a.coin].t[room.m_RoomID]) continue;
                        robot.run.qiang[a.coin].t[room.m_RoomID] = 1;
                        continue;
                    }
                    if (!!robot.run.qiang[a.coin].q[room.m_RoomID]) continue;

                    var qiangtype = {};
                    if (param['xchiz']) {
                        var cfg = param['xchiz'];
                        var total = cfg.total;
                        var win = cfg.win;
                        var lost = cfg.lose;
                        if (total == win + lost) {
                            if (robot.run.qiangcfg.t >= total) robot.run.qiangcfg = {t:0,win:0,lose:0};
                            robot.run.qiangcfg.t++;
                            var bWin = utils.GetRandomNum(0,100) < 50;
                            if (robot.run.qiangcfg.win < win && bWin) {
                                robot.run.qiangcfg.win++;
                                qiangtype['win'] = 1;
                            } else if (robot.run.qiangcfg.lose < lose) {
                                robot.run.qiangcfg.lose++;
                                qiangtype['lose'] = 1;
                            } else {
                                if (robot.run.qiangcfg.win < win) {
                                    robot.run.qiangcfg.win++;
                                    qiangtype['win'] = 1;
                                } else if (robot.run.qiangcfg.lose < lose) {
                                    robot.run.qiangcfg.lose++;
                                    qiangtype['lose'] = 1;
                                }
                            }
                        }
                    }

                    Core.GData.checkUid(robot.uid, function(a,err, user){
                        if (!user) return;
                        if (room.playerEnter(user) == consts.NOR_CODE.SUC_OK) {
                            room.PlayerQiang(user, qiangtype);

                            robot.run.qiang[a.coin].q[room.m_RoomID] = 1;
                        }
                    }.bind(a,this));
                }
            }
        }



        if (!!param['fa']) {
            var ay = param['fa'];
            for (var key in ay) {
                var a = ay[key];
                if (!robot.run) robot.run = {};
                if (!robot.run.fa) robot.run.fa = {};
                if (room.m_Coin == a.coin * 100) {
                    robot.run.fa[a.coin + ":" + a.num] = 0;
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
        if (!this.inTime(robot.time1) && !this.inTime(robot.time2) && !this.inTime(robot.time3)) return;

        try{
            var param = JSON.parse(robot.param);
        } catch(e) {
            return;
        }
        var timestamp = Date.parse(new Date()) / 1000;

        if (!robot.run.qiangcfg2) robot.run.qiangcfg2 = {t:0,win:0,lose:0,n:0};

        if (!!param['fa']) {
            var ay = param['fa'];
            for (var key in ay) {
                var a = ay[key];
                if (!robot.run) robot.run = {};
                if (!robot.run.fa) robot.run.fa = {};
                if (!robot.run.fa[a.coin + ":" + a.num]) robot.run.fa[a.coin + ":" + a.num] = 0;
                robot.run.fa[a.coin + ":" + a.num] += delta;
                if (robot.run.fa[a.coin + ":" + a.num] > a.time) {
                    robot.run.fa[a.coin + ":" + a.num] = 0;
                    for (var key in this.m_robots) {
                        if (!!this.m_robots[key].run && !!this.m_robots[key].run.fa && !!this.m_robots[key].run.fa[a.coin + ":" + a.num]) 
                            this.m_robots[key].run.fa[a.coin + ":" + a.num] = 0;
                    }

                    var qiangtype = {};
                    if (param['zchix']) {
                        var cfg = param['zchix'];
                        var total = cfg.total;
                        var win = cfg.allwin;
                        var lost = cfg.alllose;
                        var n = cfg.normal;
                        var ct = cfg.ct;
                        var ctt = 0;
                        for (var key in ct) {
                            ctt += ct[key].t;
                        } 
                        if (total == win + lost + n + ctt) {
                            if (robot.run.qiangcfg2.t >= total) robot.run.qiangcfg2 = {t:0,win:0,lose:0,n:0};
                            robot.run.qiangcfg2.t++;

                            var bFind = false;
                            var bGaiLv = utils.GetRandomNum(0,100) < 50;
                            if (robot.run.qiangcfg2.win < win && bGaiLv) {
                                robot.run.qiangcfg2.win++;
                                qiangtype['allwin'] = 1;
                                bFind = true;
                            }
                            bGaiLv = utils.GetRandomNum(0,100) < 50;
                            if (robot.run.qiangcfg2.lose < lose && bGaiLv)
                            {
                                robot.run.qiangcfg2.lose++;
                                qiangtype['alllose'] = 1;
                                bFind = true;
                            }
                            bGaiLv = utils.GetRandomNum(0,100) < 50;
                            if (robot.run.qiangcfg2.n < n && bGaiLv)
                            {
                                robot.run.qiangcfg2.n++;
                                bFind = true;
                            }
                            for (var key in ct) {
                                bGaiLv = utils.GetRandomNum(0,100) < 50;
                                if (robot.run.qiangcfg2[key] < ct[key].t && bGaiLv)
                                {
                                    robot.run.qiangcfg2[key]++;
                                    qiangtype['ctwin'] = ct[key].win;
                                    qiangtype['ctlose'] = ct[key].lose;
                                    bFind = true;
                                    break;
                                }
                            }

                            if (!bFind) {
                                if (robot.run.qiangcfg2.win < win) {
                                    robot.run.qiangcfg2.win++;
                                    qiangtype['win'] = 1;
                                    bFind = true;
                                }
                                if (robot.run.qiangcfg2.lose < lose)
                                {
                                    robot.run.qiangcfg2.lose++;
                                    qiangtype['lose'] = 1;
                                    bFind = true;
                                }
                                if (robot.run.qiangcfg2.n < n )
                                {
                                    robot.run.qiangcfg2.n++;
                                    bFind = true;
                                }
                                for (var key in ct) {
                                    if (robot.run.qiangcfg2[key] < ct[key].t)
                                    {
                                        robot.run.qiangcfg2[key]++;
                                        qiangtype['ctwin'] = ct[key].win;
                                        qiangtype['ctlose'] = ct[key].lose;
                                        bFind = true;
                                        break;
                                    }
                                }  
                            }
                        }
                    }

                    Core.GData.checkUid(robot.uid, function(a,err, user){
                        if (!user) return;
                        var coin = parseInt(a.coin);

                        var ret = this.niuniuCheck(coin);
                        if (!ret) {
                            next(null, {code: consts.NOR_CODE.ERR_PARAM});
                            return;
                        }
            
                        var c = coin * 20 + 1;
                        if (!user.lockMoney(c)) {
                            next(null, {code: consts.MONEY.MONEY_NOTENOUGH});
                            return;
                        }
            
                        var room2 = new GNiuRoom(ret, user, coin, 5);
                        this.m_hall[2].createRoom(room2);
                        room2.pushMsg(enums.PROTOCOL.GAME_NIUNIU_CREATE, {data: room2});
                        room2.playerEnter(user);
                        room2.PlayerQiang(user, qiangtype);

                        this.onTimer(room2);
                    }.bind(a,this));
                }
            }
        }
    },
    niuniuCheck:function(coin) {
        var STYPE = {
            3: 1,
            5: 1,
            10: 1,
            20: 1,
            30: 2,
            50: 2,
            100: 2,
            200: 2,
            300: 3,
            400: 3,
            500: 3,
            600: 3
        };
    
        if (!!STYPE[coin]) return STYPE[coin];
        else return false; 
    }
}).Static({
    __I:null,
    Instance: function() {
        if (!this.__I) {
            this.__I = new GNiuAI();
            this.__I.Init();
        }
        return this.__I;
    }
});
module.exports = GNiuAI;

var GNiuRoom = require('../niuniu/GNiuRoom');