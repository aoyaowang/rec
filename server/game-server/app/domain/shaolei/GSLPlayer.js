var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var async = require('async');

var Core = require("../base/Core");

var GSLPlayer = GBasePlayer.extend({
    m_Qiang:null,
    m_LastNum:null,
    m_EnterTime:null,
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
        return {uid: this.uid, nickname: Info.nickname, gamename: Info.gamename, headimg: Info.heaimg, Room: this.m_Room.m_RoomID, qiang: this.m_Qiang};
    },
    Qiang:function(q) {
        if (this.m_Qiang != 0) return false;
        this.m_Qiang = q;
        this.m_LastNum = q % 10;
        return true;
    },
    reset:function() {
        this.m_Qiang = 0;
        this.m_LastNum = -1;
    }
});
module.exports = GSLPlayer;

var GBasePlayer = require('../GBasePlayer');
