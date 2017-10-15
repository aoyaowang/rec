var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var async = require('async');

var Core = require("../base/Core");
var enums = require("../consts/enums");
var utils = require("../util/utils");

var GHall = Core.obserData.extend({
    m_Players:null,
    m_RoomID:null,
    ctor:function(Type)
    {
        this._super();
        var t = Type;
        Object.defineProperty(this, "Type", {
            get: function () { return u}
        });

        this.Value = {};
        this.m_RoomID = 0;
        this.m_Players = {};
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
        return this.Value;
    },
    createRoom:function(room)
    {
        var value = this.Value;
        this.m_RoomID ++;
        room.m_Hall = this;
        room.m_RoomID = this.m_RoomID;
        value[this.m_RoomID] = room;
    },
    removeRoom:function(room)
    {
        var value = this.Value;
        if (!room) return;
        delete value[room.m_RoomID];
    },
    playerEnter:function(user, type) {
        if (this.m_Players[user.uid]) return;
        this.m_Players[user.uid] = {user: user, type: type};
    },
    playerLeave:function(user) {
        if (!this.m_Players[user.uid]) return;
        delete this.m_Players[user.uid];
    },
    pushMsg:function(protocol, msg, type) {
        for (var k in this.m_Players) {
            var p = this.m_Players[k].user;
            var t = this.m_Players[k].type;
            if (!!type && t != type) continue;
            p.addMsg(protocol, msg);
        }
    }
});
module.exports = GHall;
