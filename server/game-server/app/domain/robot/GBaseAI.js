var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var async = require('async');

var Core = require("../base/Core");
var enums = require("../consts/enums");
var utils = require("../util/utils");

var GBaseAI = Core.obserData.extend({
    m_robots: null,
    ctor:function()
    {
        this._super();
        
        this.m_robots = {};

        var tick = pomelo.app.get('tickManager');
        tick.addTick(this.CheckTimer,this,1,1);
    },
    factoryData:function() {
        return {};
    },
    Dispose:function()
    {
        this._super();
    },
    onTimer:function(room) {

    },
    onRobotChange:function(robots) {
        if (!robots) return;
        for (var key in robots) {
            var a = robots[key];
            if (a.changetype == enums.CHANGETYPE.ADD) {
                this.m_robots[a.uid] = a;
                delete a.changetype;
            } else {
                if (this.m_robots[a.uid]) {
                    delete this.m_robots[a.uid];
                }
            }
        }
    },
    CheckTimer:function() {
        var tick = pomelo.app.get('tickManager');
        tick.addTick(this.CheckTimer,this,1,1);

        this.TimerFunc(1);
    },
    TimerFunc:function(delta) {

    },
    inTime:function(t) {
        if (t == "") return false;
        try {
            var time = JSON.parse(t);
        } catch(e) {
            return false;
        }
        
        if (!time.btime || !time.etime) return false;
        var bh = parseInt(time.btime.split(':')[0]);
        var bm = parseInt(time.btime.split(':')[1]);
        var eh = parseInt(time.etime.split(':')[0]);
        var em = parseInt(time.etime.split(':')[1]);
        var now = new Date();
        if (now.getHours() < bh || now.getHours() > eh) return false;
        if (now.getHours() == bh && bm < now.getMinutes()) return false;
        if (now.getHours() == eh && em > now.getMinutes()) return false;

        return true;
    },
});
module.exports = GBaseAI;