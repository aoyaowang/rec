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
var GJLRoom = require('../../../domain/jielong/GJLRoom');
var GNiuRoom = require('../../../domain/niuniu/GNiuRoom');
var G28Room = require('../../../domain/28/G28Room');

var Core = require('../../../base/Core');
var baseRemote = require('../../../base/baseRemote');
var GRobotMgr = require('../../../domain/GRobotMgr');

var userDao = require('../../../dao/userDao');
var httppost = require('../../../util/httppost');

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
    Core.GData.checkUid = checkUid;
    GRobotMgr.Instance();
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

    var user = new User();
    user.init(uid, function(err, res){
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
        next(null, null);
        return;
    }

    var timestamp = Date.parse(new Date()) / 1000;

    var uid = t.uid;
    if (!this.m_db[uid]) {
        var user = new User();
        user.init(uid, function(err, res){
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
        next(null, {code: consts.NOR_CODE.SUC_OK, sync: user.getSync()});
    }.bind(this))
}

pro.getHallInfo = function(token, id, next) {
    this.checkToken(token, function(err, user){
        if (!user) {
            next(null, {code: consts.NOR_CODE.FAILED});
            return;
        }
        var hall = this.m_hall[id];
        next(null, {code: consts.NOR_CODE.SUC_OK, data: hall, sync: user.getSync()});
    }.bind(this))
}

pro.getRooms = function(token, id, type, next) {
    if (id == null || type == null) {
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
        next(null, {code: consts.NOR_CODE.SUC_OK, sync: user.getSync()});

        if (id == 1&&this.m_hall[1].m_CurRoom[type])        
            user.addMsg(enums.PROTOCOL.GAME_JIELONG_CREATE, {data: this.m_hall[1].m_CurRoom[type]});
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
        next(null, {code: consts.NOR_CODE.SUC_OK, data: hall, sync: user.getSync()});
    }.bind(this))
}

pro.saoleiType = function(coin) {
    var STYPE = {
        1: {min: 10, max: 100, step: 10},
        2: {min: 100, max: 500, step: 50},
        3: {min: 500, max: 2000, step: 100}
    }

    var t = null;
    var bFind = false;
    for (var key in STYPE) {
        if (coin >= STYPE[key].min || coin <= STYPE[key].max) {
            for (var m = STYPE[key].min; m <= STYPE[key].max;m += STYPE[key].step) {
                if (m == coin) {
                    bFind = true;
                    t = key;
                    break;
                }
            }
            if (bFind) break;
        }
    }
    if (!bFind) {
        return false;
    }

    return t;
}

pro.jielongCheck = function(coin) {
    var STYPE = {
        3: 5,
        5: 5,
        10: 5,
        20: 5,
        30: 5,
        50: 5,
        100: 5,
        200: 5,
        300: 5,
        500: 5
    };

    if (!!STYPE[coin]) return true;
    else return false; 
}

pro.niuniuCheck = function(coin) {
    var STYPE = {
        3: 1,
        5: 1,
        10: 1,
        20: 1,
        30: 2,
        50: 2,
        100: 2,
        200: 2,
        300: 3,
        400: 3,
        500: 3,
        600: 3
    };

    if (!!STYPE[coin]) return STYPE[coin];
    else return false; 
}

pro.game28Check = function(coin) {
    var STYPE = {
        3: 1,
        5: 1,
        10: 1,
        20: 1,
        30: 2,
        50: 2,
        100: 2,
        200: 2,
        300: 3,
        400: 3,
        500: 3,
        600: 3
    };

    if (!!STYPE[coin]) return STYPE[coin];
    else return false; 
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
            var coin = parseInt(room.coin);
            var num = parseInt(room.num);
            var bomb = parseInt(room.bomb);

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

            if (!user.lockMoney(coin)) {
                next(null, {code: consts.MONEY.MONEY_NOTENOUGH});
                return;
            }
            var room2 = new GSLRoom(type, user, coin, num, bomb);
            this.m_hall[0].createRoom(room2);
            room2.pushMsg(enums.PROTOCOL.GAME_SHAOLEI_CREATE, {data: room2});
            next(null, {code: consts.NOR_CODE.SUC_OK, sync: user.getSync()});
        }
        else if (type == 2) //接龙
        {
            var coin = parseInt(room.coin);
            if (coin == null || !this.jielongCheck(coin)) {
                next(null, {code: consts.NOR_CODE.ERR_PARAM});
                return;
            }

            if (!!this.m_hall[1].m_CurRoom[coin]) {
                next(null, {code: consts.NOR_CODE.SUC_OK});
                return;
            }

            var room2 = new GJLRoom(coin, user, coin, 5, true);
            this.m_hall[1].createRoom(room2);
            this.m_hall[1].m_CurRoom[coin] = room2;
            room2.pushMsg(enums.PROTOCOL.GAME_JIELONG_CREATE, {data: room2});
            next(null, {code: consts.NOR_CODE.SUC_OK, sync: user.getSync()});

        }
        else if (type == 3) //牛牛
        {
            var coin = parseInt(room.coin);
            var ret = this.niuniuCheck(coin);
            if (!ret) {
                next(null, {code: consts.NOR_CODE.ERR_PARAM});
                return;
            }

            var c = coin * 20 + 1;
            if (!user.lockMoney(c)) {
                next(null, {code: consts.MONEY.MONEY_NOTENOUGH});
                return;
            }

            var room2 = new GNiuRoom(ret, user, coin, 5);
            this.m_hall[2].createRoom(room2);
            room2.pushMsg(enums.PROTOCOL.GAME_NIUNIU_CREATE, {data: room2});
            room2.playerEnter(user);
            room2.PlayerQiang(user);
            next(null, {code: consts.NOR_CODE.SUC_OK, sync: user.getSync()});
        }
        else if (type == 4) //28
        {
            var coin = parseInt(room.coin);
            var ret = this.game28Check(coin);
            if (!ret) {
                next(null, {code: consts.NOR_CODE.ERR_PARAM});
                return;
            }

            var c = coin * 3 + 1;
            if (!user.lockMoney(c)) {
                next(null, {code: consts.MONEY.MONEY_NOTENOUGH});
                return;
            }

            var room2 = new G28Room(ret, user, coin);
            this.m_hall[3].createRoom(room2);
            room2.pushMsg(enums.PROTOCOL.GAME_28_CREATE, {data: room2});
            room2.playerEnter(user);
            room2.PlayerQiang(user);
            next(null, {code: consts.NOR_CODE.SUC_OK, sync: user.getSync()});
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
        var room = hall.Value[roomid];
        if (!room) {
            next(null, {code: consts.NOR_CODE.ERR_PARAM});
            return;
        }
        if (room.PlayerQiang) 
        {
            var eret = room.playerEnter(user);
            if (eret != consts.NOR_CODE.SUC_OK) {
                next(null, {code: eret});
                return;
            }
            var ret = room.PlayerQiang(user);
            if (ret)
                next(null, {code: consts.NOR_CODE.SUC_OK, sync: user.getSync()});
            else
                next(null, {code: consts.GAME.RED_OVER});
        } else {
            next(null, {code: consts.NOR_CODE.ERR_PARAM});
        }

    }.bind(this));
}

pro.jielongQiang = function(token, hallid, roomid, next) {
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
        var room = hall.Value[roomid];
        if (!room) {
            next(null, {code: consts.NOR_CODE.ERR_PARAM});
            return;
        }
        if (room.PlayerQiang) 
        {
            var eret = room.playerEnter(user);
            if (eret != consts.NOR_CODE.SUC_OK) {
                next(null, {code: eret});
                return;
            }
            var ret = room.PlayerQiang(user);
            if (ret)
                next(null, {code: consts.NOR_CODE.SUC_OK, sync: user.getSync()});
            else
                next(null, {code: consts.GAME.RED_OVER});
        } else {
            next(null, {code: consts.NOR_CODE.ERR_PARAM});
        }

    }.bind(this));
}

pro.niuniuQiang = function(token, hallid, roomid, next) {
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
        var room = hall.Value[roomid];
        if (!room) {
            next(null, {code: consts.NOR_CODE.ERR_PARAM});
            return;
        }
        if (room.PlayerQiang) 
        {
            var eret = room.playerEnter(user);
            if (eret != consts.NOR_CODE.SUC_OK) {
                next(null, {code: eret});
                return;
            }
            var ret = room.PlayerQiang(user);
            if (ret)
                next(null, {code: consts.NOR_CODE.SUC_OK, sync: user.getSync()});
            else
                next(null, {code: consts.GAME.RED_OVER});
        } else {
            next(null, {code: consts.NOR_CODE.ERR_PARAM});
        }

    }.bind(this));
}

pro.getDetail = function(token, hallid, roomid, next) {
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
        var room = hall.Value[roomid];
        if (!room) {
            next(null, {code: consts.NOR_CODE.ERR_PARAM});
            return;
        }
        next(null, {code: consts.NOR_CODE.SUC_OK, data: room.detail(user.uid), sync: user.getSync()});

    }.bind(this));
}

pro.checkUid = function(uid, next) {
    if (!uid) {
        next(null, null);
        return;
    }

    var timestamp = Date.parse(new Date()) / 1000;

    if (!this.m_db[uid]) {
        var user = new User();
        user.init(uid, function(err, res){
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

pro.bill = function(uid, billid, fee, next) {
    this.checkUid(uid, function(err,user) {
        if (!user) {
            next(null, {code: consts.NOR_CODE.FAILED});
            return;
        }

        userDao.existBill(billid, function(err, res){
            if (!!res && res.length > 0) {
                userDao.updateBill(billid, fee, function(err, res){
                    user.unlockMoney(0, fee);
                    next(null, {code: consts.NOR_CODE.SUC_OK});
                });
            } else {
                next(null, {code: consts.NOR_CODE.FAILED});
            }
        });

    });
}

pro.fkbill = function(uid, billid, fee, next) {
    this.checkUid(uid, function(err,user) {
        if (!user) {
            next(null, {code: consts.NOR_CODE.FAILED});
            return;
        }
        var map = {
            1: 1,
            49: 50,
            95: 100
        };
        var fee = map[fee] || fee;
        
        userDao.existBill(billid, function(err, res){
            if (!!res && res.length > 0) {
                userDao.updateBill(billid, fee, function(err, res){
                    user.unlockFangKa(0, fee);
                    next(null, {code: consts.NOR_CODE.SUC_OK});
                });
            } else {
                next(null, {code: consts.NOR_CODE.FAILED});
            }
        });

    });
}

pro.turnto = function(token, uid, money, next) {
    money = parseInt(money);
    if (!money || money < 0) {
        next(null, {code: consts.MONEY.MONEY_NOTENOUGH});
        return;
    }

    this.checkToken(token, function(err, user){
        if (!user) {
            next(null, {code: consts.NOR_CODE.FAILED});
            return;
        }

        if (!user.lockMoney(money)) {
            next(null, {code: consts.MONEY.MONEY_NOTENOUGH});
            return;
        }

        if (uid != user.uid) {
            this.checkUid(uid, function(err,touser) {
                user.unlockMoney(money, -1 * money);
                if (!touser) {
                    next(null, {code: consts.NOR_CODE.FAILED});
                    return;
                }
                
                touser.unlockMoney(0, parseInt(money * 0.7) / 100);
            });
            return;
        } else {
            httppost.turn(user.openid, money, function(err, data){
                console.warn(JSON.stringify(data));
                data = data || "";
                if (data.indexOf('<return_code><![CDATA[SUCCESS]]></return_code>') >= 0) {
                    user.unlockMoney(money, -1 * money);
                    next(null, {code: consts.NOR_CODE.SUC_OK});
                } else {
                    user.unlockMoney(money, 0);
                    next(null, {code: consts.NOR_CODE.FAILED});
                }
            });
        }
        next(null, {code: consts.NOR_CODE.SUC_OK});
    }.bind(this));
}

///////////////////////////////////////////////////////////////////////////////////

pro.getallrobot = function(next) {
    userDao.getAllRobot(function(err, res){
        var robots = res;
        var rotconfig = GRobotMgr.Instance().getAllRobot();
        next(null, {code: consts.NOR_CODE.SUC_OK, data: robots, config: rotconfig});
    }.bind(this));
}

pro.configrobot = function(uids, game, param, time1, time2, time3, next) {

    var ay = [];
    for (var k in uids) {
        ay.push({
            uid: uids[k],
            game: game,
            param: param,
            time1: time1,
            time2: time2,
            time3: time3,
            changetype: enums.CHANGETYPE.ADD
        });
    }

    GRobotMgr.Instance().configChange(ay);
    next(null, {code: consts.NOR_CODE.SUC_OK});
}

pro.deleterobot = function(uids, next) {
    var ay = [];
    for (var k in uids) {
        ay.push({
            uid: uids[k],
            changetype: enums.CHANGETYPE.DEL
        });
    }

    GRobotMgr.Instance().configChange(ay);
    next(null, {code: consts.NOR_CODE.SUC_OK});
}

pro.createrobot = function(infos, next) {
    userDao.createRobot(infos, function(err, res){
        next(null, {code: consts.NOR_CODE.SUC_OK, data: res});
    });
}

pro.upscore = function(uids, m, f, next) {
    for (var key in uids) {
        var uid = uids[key];
        this.checkUid(uid, function(err,touser) {
            if (!touser) {
                return;
            }
            
            touser.unlockMoney(0, parseInt(m));
            touser.unlockFangKa(0, parseInt(f));
        });
    }

    next(null, {code: consts.NOR_CODE.SUC_OK});
}