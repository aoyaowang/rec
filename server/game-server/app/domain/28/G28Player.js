var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var async = require('async');

var Core = require("../../base/Core");

var GBasePlayer = require('../GBasePlayer');

var G28Player = GBasePlayer.extend({
    m_Qiang:null,
    m_LastNum:null,
    m_LastNum2:null,
    m_Result:null,
    m_EnterTime:null,
    m_Time:null,
    ctor:function(user)
    {
        GBasePlayer.prototype.ctor.apply(this,arguments);

        this.reset();
    },
    factoryData:function() {
        return {};
    },
    Dispose:function()
    {
        this._super();
    },
    toJSON:function()
    {
        return {uid: this.uid, nickname: this.Info.nickname, gamename: this.Info.gamename, 
                headimg: this.Info.headimg, Room: this.m_Room.m_RoomID, qiang: this.m_Qiang, last: this.m_LastNum, result: this.m_Result, time: this.m_Time};
    },
    Qiang:function(q) {
        if (this.m_Qiang != 0) return false;
        this.m_Qiang = q;
        this.m_LastNum = q % 10;
        this.m_LastNum2 = parseInt((q % 100 - this.m_LastNum) / 10);
        this.m_Time= Date.parse(new Date()) / 1000;
        return true;
    },
    reset:function() {
        this.m_Qiang = 0;
        this.m_LastNum = -1;
        this.m_LastNum2 = -1;
        this.m_Result = 0;
    },
    CardType:function() {
        if (this.m_LastNum == -1 || this.m_LastNum2 == -1) return -1;

        var ret = 100;
        if (this.m_LastNum == this.m_LastNum2) {
            ret += 100 * this.m_LastNum;
        }
        else if ((this.m_LastNum == 2 && this.m_LastNum2 == 8) || (this.m_LastNum2 == 2 && this.m_LastNum == 8))
        {
            ret = 100;   
        }
        else {
            ret = (this.m_LastNum + this.m_LastNum2) % 10 * 10 + Math.max(this.m_LastNum, this.m_LastNum2);
        }
        return ret;
    }
});
module.exports = G28Player;

