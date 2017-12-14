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
    qianggailv: -1, %
    fagailv: -1, %
    buqiang: 50s,
    qiang: [
        coin: 10,
        q: 10t,
        t: 2t
    ],
    fa: [
        coin: 10,
        num: 7,
        time: 60s,
        qiang: false
    ]
}
*/

var GSLAI = GBaseAI.extend({
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

        var ql = param['qianggailv'] || -1;
        var fl = param['fagailv'] || -1;

        var mustqiang = ql == -1 ? null : utils.GetRandomNum(0, 100) > ql;
        if (!!param['buqiang']) {
            var t = parseInt(param['buqiang']);
            if (timestamp - room.m_BeginTime > t) {
                Core.GData.checkUid(robot.uid, function(err, user){
                    if (!user) return;
                    if (room.playerEnter(user) == consts.NOR_CODE.SUC_OK) {
                        room.PlayerQiang(user, mustqiang);
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
                    Core.GData.checkUid(robot.uid, function(x,err, user){
                        if (!user) return;
                        if (room.playerEnter(user) == consts.NOR_CODE.SUC_OK) {
                            room.PlayerQiang(user, mustqiang);

                            robot.run.qiang[x.coin].q[room.m_RoomID] = 1;
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

        var ql = param['qianggailv'] || -1;
        var fl = param['fagailv'] || -1;

        var must = fl == -1 ? null : utils.GetRandomNum(0, 100) < fl;
        var mustqiang = ql == -1 ? null : utils.GetRandomNum(0, 100) > ql;

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
                    Core.GData.checkUid(robot.uid, function(x,err, user){
                        if (!user) return;
                        var coin = parseInt(x.coin);
                        var num = parseInt(x.num);
                        var bomb = parseInt(parseInt(Math.random()*9, 10));
            
                        if (num != 7 && num != 10) {
                            return;
                        }
            
                        if (bomb === null) {
                            return;
                        }
            
                        var type = this.saoleiType(coin);
                        if (!type) {
                            return;
                        }
            
                        if (!user.lockMoney(coin)) {
                            return;
                        }
                        var room2 = new GSLRoom(type, user, coin, num, bomb, must);
                        Core.GData.m_hall[0].createRoom(room2);
                        room2.pushMsg(enums.PROTOCOL.GAME_SHAOLEI_CREATE, {data: room2});
                        if (x.qiang) {
                            if (room2.playerEnter(user) == consts.NOR_CODE.SUC_OK) {
                                room2.PlayerQiang(user, mustqiang);
                            }
                        }
                        this.onTimer(room2);
                    }.bind(a,this));
                }
            }
        }
    },
    saoleiType:function(coin) {
        var STYPE = {
            1: {min: 10, max: 100, step: 10},
            2: {min: 100, max: 500, step: 50},
            3: {min: 500, max: 2000, step: 100}
        }
    
        var t = null;
        var bFind = false;
        for (var key in STYPE) {
            if (coin >= STYPE[key].min || coin <= STYPE[key].max) {
                for (var m = STYPE[key].min; m <= STYPE[key].max;m += STYPE[key].step) {
                    if (m == coin) {
                        bFind = true;
                        t = key;
                        break;
                    }
                }
            }
        }
        if (!bFind) {
            return false;
        }
    
        return t;
    }
}).Static({
    __I:null,
    Instance: function() {
        if (!this.__I) {
            this.__I = new GSLAI();
            this.__I.Init();
        }
        return this.__I;
    }
});
module.exports = GSLAI;

var GSLRoom =require('../shaolei/GSLRoom');