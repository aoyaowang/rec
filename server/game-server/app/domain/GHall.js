var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var async = require('async');

var Core = require("../base/Core");
var enums = require("../consts/enums");
var utils = require("../util/utils");

var GHall = Core.obserData.extend({
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
    }
});
module.exports = GHall;
