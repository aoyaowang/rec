var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var async = require('async');

var Core = require("../../base/Core");

var GBasePlayer = require('../GBasePlayer');

var GSLPlayer = GBasePlayer.extend({
    m_Qiang:null,
    m_LastNum:null,
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
        this.m_Time= Date.parse(new Date()) / 1000;
        return true;
    },
    reset:function() {
        this.m_Qiang = 0;
        this.m_LastNum = -1;
        this.m_Result = 0;
    }
});
module.exports = GSLPlayer;

