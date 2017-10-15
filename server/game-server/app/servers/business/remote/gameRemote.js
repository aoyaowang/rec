var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var async = require('async');
var fs = require('fs');

var consts = require('../../../consts/consts');
var enums = require('../../../consts/enums');
var power = require('../../../../config/session').key;
var secret = require('../../../../config/session').secret;

var Token = require('../../../util/token');
var User = require('../../../domain/user');
var GHall = require('../../../domain/GHall');

var GSLRoom = require('../../../domain/shaolei/GSLRoom');

var Core = require('../../../base/Core');

module.exports = function(app) {
    return new Remote(app);
};

var Remote = function(app) {
    this.app = app;
};

Remote.prototype = new baseRemote();
var pro = Remote.prototype;

pro.Init = function(next) {
    next(null,null);

    this.m_db = {};

    this.app.get('tickManager').addTick(this.Sync, this, 5000, 1);
    
    this.m_hall = {};
    for (var i = 0;i < enums.HALL_TPYE_NUM;++i) {
        this.m_hall[i] = new GHall(i);
    }
    Core.GData = {};
    Core.GData.m_hall = this.m_hall;
};

pro.Sync = function() {
    this.app.get('tickManager').addTick(this.Sync, this, 5000, 1);
    var timestamp = Date.parse(new Date()) / 1000;

    for (var key in this.m_db) {
        if (this.m_db[key].synctime + 30 < timestamp) {
            this.m_db[key].logined = false;
            var user = this.m_db[key];
            if (user.HallType) {
                var hall = this.m_hall[user.HallType];
                user.HallType = null;
                hall.playerLeave(user);            
            }
        }
    }
};

pro.userEnter = function(token, next) {
    var t = Token.parse(token, secret);

    if (!t) {
        next(null, {code: consts.NOR_CODE.ERR_PARAM});
        return;
    }

    var uid = t.uid;

    var user = new User;
    user.Init(uid, function(err, res){
        if (!!err) {
            next(null, {code: consts.NOR_CODE.FAILED});
            return;
        }
        this.m_db[uid] = user;
        next(null, {code: consts.NOR_CODE.SUC_OK});
    }.bind(this));
}

pro.checkToken = function(token, next) {
    var t = Token.parse(token, secret);

    if (!t) {
        next(null, {code: consts.NOR_CODE.ERR_PARAM});
        return;
    }

    var timestamp = Date.parse(new Date()) / 1000;

    var uid = t.uid;
    if (!this.m_db[uid]) {
        var user = new User;
        user.Init(uid, function(err, res){
            if (!!err) {
                next(null, null);
                return;
            }
            this.m_db[uid] = user;
            next(null, user);
        }.bind(this));
    } else {
        var user = this.m_db[uid];
        if (!user.logined) {
            user.reLogin();
        }
        user.logined = true;
        user.synctime = timestamp;
        next(null, user);
    }
}

pro.userSync = function(token, next) {
    this.checkToken(token, function(err, user){
        if (!user) {
            next(null, {code: consts.NOR_CODE.FAILED});
            return;
        }
        next(null, {code: consts.NOR_CODE.SUC_OK, data: user.sync});
    }.bind(this))
}

pro.getRooms = function(token, id, type, next) {
    if (id == null || type == null) {
        next(null, {code: consts.NOR_CODE.ERR_PARAM});
        return;
    }
    if (type != 1 && type != 2 && type != 3) {
        next(null, {code: consts.NOR_CODE.ERR_PARAM});
        return;
    }
    this.checkToken(token, function(err, user){
        if (!user) {
            next(null, {code: consts.NOR_CODE.FAILED});
            return;
        }
        var hall = this.m_hall[id];
        user.HallType = id;
        hall.playerEnter(user, type);
        next(null, {code: consts.NOR_CODE.SUC_OK});
    }.bind(this))
}

pro.leaveHall = function(token, next) {
    this.checkToken(token, function(err, user){
        if (!user) {
            next(null, {code: consts.NOR_CODE.FAILED});
            return;
        }
        var hall = this.m_hall[user.HallType];
        user.HallType = null;
        hall.playerLeave(user);
        next(null, {code: consts.NOR_CODE.SUC_OK, data: hall});
    }.bind(this))
}

pro.saoleiType = function(coin) {
    var STYPE = {
        1: {min: 10, max: 100, step: 10},
        2: {min: 100, max: 500, step: 50},
        3: {min: 500, max: 200, step: 100}
    }

    var t = null;
    var bFind = false;
    for (var key in STYPE) {
        if (coin > STYPE[key].min || coin < STYPE[key].max) {
            for (var m = STYPE[key].min; m <= STYPE[key.max];m += STYPE[step]) {
                if (m == coin) {
                    bFind = true;
                    t = key;
                }
            }
        }
    }
    if (!bFind) {
        return false;
    }

    return t;
}

pro.createRoom = function(token, room, next) {
    if (!room) {
        next(null, {code: consts.NOR_CODE.ERR_PARAM});
        return;
    }

    this.checkToken(token, function(err, user){
        if (!user) {
            next(null, {code: consts.NOR_CODE.FAILED});
            return;
        }

        var type = room.type;
        if (type == 1) //扫雷
        {
            var coin = room.coin;
            var num = room.num;
            var bomb = room.bomb;

            if (num != 7 && num != 10) {
                next(null, {code: consts.NOR_CODE.ERR_PARAM});
                return;
            }

            if (bomb === null) {
                next(null, {code: consts.NOR_CODE.ERR_PARAM});
                return;
            }

            var type = this.saoleiType(coin);
            if (!type) {
                next(null, {code: consts.NOR_CODE.ERR_PARAM});
                return;
            }

            if (!user.lockFangka(1)) {
                next(null, {code: consts.MONEY.FANGKA_NOTENOUGH});
                return;
            }

            if (!user.lockMoney(coin)) {
                next(null, {code: consts.MONEY.MONEY_NOTENOUGH});
                return;
            }

            var room = new GSLRoom(type, user, coin, num, bomb);
            this.m_hall[0].createRoom(room);
            room.pushMsg(enums.PROTOCOL.GAME_SHAOLEI_CREATE, {data: room});
        }
    }.bind(this));
}

pro.saoleiQiang = function(token, hallid, roomid, next) {
    this.checkToken(token, function(err, user){
        if (!user) {
            next(null, {code: consts.NOR_CODE.FAILED});
            return;
        }

        var hall = this.m_hall[hallid];
        if (!hall) {
            next(null, {code: consts.NOR_CODE.ERR_PARAM});
            return;
        }
        user.HallType = hallid;
        var room = hall.Value[roomid];
        if (!room) {
            next(null, {code: consts.NOR_CODE.ERR_PARAM});
            return;
        }
        if (room.PlayerQiang) 
        {
            var ret = room.PlayerQiang(user);
            if (ret)
                next(null, {code: consts.NOR_CODE.SUC_OK});
            else
                next(null, {code: consts.GAME.RED_OVER});
        } else {
            next(null, {code: consts.NOR_CODE.ERR_PARAM});
        }

    }.bind(this));
}