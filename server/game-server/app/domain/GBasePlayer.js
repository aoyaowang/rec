var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var async = require('async');

var Core = require("../base/Core");

var GBasePlayer = Core.obserData.extend({
    m_Room:null,
    m_Position:null,
    ctor:function(user)
    {
        this._super();
        var u = user;
        Object.defineProperty(this, "Info", {
            get: function () { return u}
        });

        Object.defineProperty(this, "uid", {
            get: function () { return u.uid}
        });
        this.m_Room = null;
        this.m_Position = null;
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
        return {uid: this.uid, nickname: Info.nickname, gamename: Info.gamename, sex: Info.sex, headimg: Info.headimg, Room: this.m_Room.m_RoomID, Pos: this.m_position};
    }
});
module.exports = GBasePlayer;
