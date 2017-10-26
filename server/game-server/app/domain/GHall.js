var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var async = require('async');

var Core = require("../base/Core");
var enums = require("../consts/enums");
var utils = require("../util/utils");

var GHall = Core.obserData.extend({
    m_Players:null,
    m_PlayerCount: null,
    m_RoomID:null,
    ctor:function(Type)
    {
        this._super();
        var t = Type;
        Object.defineProperty(this, "Type", {
            get: function () { return t}
        });

        this.Value = {};
        this.m_RoomID = 0;
        this.m_Players = {};
        this.m_PlayerCount = 0;

        if (this.Type == 1) this.m_CurRoom = {};
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
        return {type: this.Type, num: this.m_PlayerCount};
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
        if (this.m_Players[user.uid]) {
            this.playerLeave(user);
        }
        this.pushMsg(enums.PROTOCOL.PLAYER_ENTER, {data: user}, type);
        this.m_Players[user.uid] = {user: user, type: type};
        this.m_PlayerCount = utils.size(this.m_Players);

        if (this.Type == 1 && this.m_CurRoom[type]) {
            user.addMsg(enums.PROTOCOL.GAME_JIELONG_CREATE, {data: this.m_CurRoom[type]});
        }
    },
    playerLeave:function(user) {
        if (!this.m_Players[user.uid]) return;
        var p = this.m_Players[user.uid];
        delete this.m_Players[user.uid];
        this.m_PlayerCount = utils.size(this.m_Players);
        this.pushMsg(enums.PROTOCOL.PLAYER_LEAVE, {data: user},p.type);
    },
    pushMsg:function(protocol, msg, type) {
        var all = [];
        for (var k in this.m_Players) {
            
            var p = this.m_Players[k].user;
            var t = this.m_Players[k].type;
            console.warn("PLAYER:" + p.nickname + " TYPE:" + t);
            if (!!type && t != type) continue;
            all.push(p.nickname);
            p.addMsg(protocol, msg);
        }
        console.warn("PUSHMSG:" + type + " DATA:" + protocol + " ALL:" + JSON.stringify(all));
    }
});
module.exports = GHall;
