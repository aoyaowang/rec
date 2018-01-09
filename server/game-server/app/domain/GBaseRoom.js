var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var async = require('async');

var Core = require("../base/Core");
var enums = require("../consts/enums");
var utils = require("../util/utils");

var GBaseRoom = Core.obserData.extend({
    m_Players: null,
    m_PlayerCount:null,
    m_Pos:null,
    m_Hall:null,
    m_RoomID:null,
    m_CreatTime: null,
    ctor:function(Type)
    {
        this._super();
        var t = Type;
        Object.defineProperty(this, "Type", {
            get: function () { return t}
        });

        this.m_Players = {};
        this.m_Pos = {};
        this.m_PlayerCount = 0;
        this.m_CreatTime = Date.parse(new Date()) / 1000;
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
        return {HallType: this.m_Hall ? this.m_Hall.Type : -1, RoomID:this.m_RoomID,Type: this.Type, Playes: this.m_Players};
    },
    playerEnter:function(user) {
        for (var key in this.m_Players) {
            this.m_Players[key].Info.addMsg(enums.PROTOCOL.PLAYER_ENTER, {data: user})
        }        
        var player = new GBasePlayer(user);
        this.m_Players[player.uid] = player;
        this.m_PlayerCount = utils.size(this.m_Players);
        player.m_Room = this;
        player.m_Position = this.m_PlayerCount;
        player.Info.inGame.push(this);

        this.updatePos();
    },
    playerleave:function(user) {
        for (var key in this.m_Players) {
            this.m_Players[key].Info.addMsg(enums.PROTOCOL.PLAYER_LEAVE, {data: user});
        }
        var player = this.m_Players[user.uid];
        delete this.m_Players[user.uid];
        if (player) {
            player.m_Room = null;
            player.m_Position = null;
            for (var key in player.Info.inGame) {
                if (player.Info.inGame[key] == this) {
                    player.Info.inGame.splice(key, 1);
                    break;
                }
            }
        }
        this.m_PlayerCount = utils.size(this.m_Players);

        this.updatePos();
    },
    updatePos:function() {
        this.m_Pos = {};
        for (var key in this.m_Players) {
            var p = this.m_Players[key];
            this.m_Pos[p.m_Position] = p;
        }
    },
    pushMsg:function(protocol, msg) {
        if (this.m_Hall)
            this.m_Hall.pushMsg(protocol, msg, this.Type);
    }
});
module.exports = GBaseRoom;

var GBasePlayer = require('./GBasePlayer');