var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var async = require('async');

var Core = require("../base/Core");
var enums = require("../consts/enums");
var utils = require("../util/utils");
var robotDao = require('../dao/robotDao');
var GRobotMgr = Core.obserData.extend({
    m_robots: null,
    m_bInit: null,
    ctor:function()
    {
        this._super();
        // var t = Type;
        // Object.defineProperty(this, "Type", {
        //     get: function () { return t}
        // });
        this.m_bInit = false;
        this.m_robots = {};
    },
    Init:function() {
        robotDao.getAll(function(err, res){
            var ay1 = [], ay2 = [], ay3 = [], ay4 = [];
            for (var i = 0;i < res.length;++i) {
                var a = res[i];
                this.m_robots[a.uid] = a;
                a.changetype = enums.CHANGETYPE.ADD;
                if (a.game == 0) ay1.push(a);
                else if (a.game == 1) ay2.push(a);
                else if (a.game == 2) ay3.push(a);
                else if (a.game == 3) ay4.push(a);
            }
            GSLAI.Instance().onRobotChange(ay1);
            GJLAI.Instance().onRobotChange(ay2);
            GNiuAI.Instance().onRobotChange(ay3);
            G28AI.Instance().onRobotChange(ay4);

            this.m_bInit = true;
        }.bind(this));
    },
    factoryData:function() {
        return {};
    },
    Dispose:function()
    {
        this._super();
    },
    onTimer:function(room) {
        if (!room || !this.m_bInit) return;
        if (room.m_Hall.Type == 0) //SL
        {
            GSLAI.Instance().onTimer(room);
        }
        else if (room.m_Hall.Type == 1) //JL
        {
            GJLAI.Instance().onTimer(room);
        }
        else if (room.m_Hall.Type == 2) //NiuNiu
        {
            GNiuAI.Instance().onTimer(room);
        }
        else if (room.m_Hall.Type == 3) //28
        {
            G28AI.Instance.onTimer(room);
        }
    },
    configChange:function(ay) {
        for (var key in ay) {
            var a = ay[key];
            if (a.changetype == enums.CHANGETYPE.DEL) {
                if (this.m_robots[a.uid]) {
                    if (this.m_robots[a.uid].game == 0) GSLAI.Instance().onRobotChange([a]);
                    else if (this.m_robots[a.uid].game == 1) GJLAI.Instance().onRobotChange([a]);
                    else if (this.m_robots[a.uid].game == 2) GNiuAI.Instance().onRobotChange([a]);
                    else if (this.m_robots[a.uid].game == 3) G28AI.Instance().onRobotChange([a]);
                }
                robotDao.delete(a.uid, function(){});
            } else {
                if (this.m_robots[a.uid]) {
                    a.changetype = enums.CHANGETYPE.DEL;
                    if (this.m_robots[a.uid].game == 0) GSLAI.Instance().onRobotChange([a]);
                    else if (this.m_robots[a.uid].game == 1) GJLAI.Instance().onRobotChange([a]);
                    else if (this.m_robots[a.uid].game == 2) GNiuAI.Instance().onRobotChange([a]);
                    else if (this.m_robots[a.uid].game == 3) G28AI.Instance().onRobotChange([a]);
                }
                this.m_robots[a.uid] = a;
                a.changetype = enums.CHANGETYPE.ADD;
                if (this.m_robots[a.uid].game == 0) GSLAI.Instance().onRobotChange([a]);
                else if (this.m_robots[a.uid].game == 1) GJLAI.Instance().onRobotChange([a]);
                else if (this.m_robots[a.uid].game == 2) GNiuAI.Instance().onRobotChange([a]);
                else if (this.m_robots[a.uid].game == 3) G28AI.Instance().onRobotChange([a]);    

                robotDao.robot([a], function(){});
            }
        }
    },
    getAllRobot:function() {
        return this.m_robots;
    }
}).Static({
    __I:null,
    Instance: function() {
        if (!this.__I) {
            this.__I = new GRobotMgr();
            this.__I.Init();
        }
        return this.__I;
    }
});
module.exports = GRobotMgr;

var G28AI = require('./robot/G28AI');
var GJLAI = require('./robot/GJLAI');
var GNiuAI = require('./robot/GNiuAI');
var GSLAI = require('./robot/GSLAI');