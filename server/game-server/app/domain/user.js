var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var async = require('async');
var fs = require('fs');
var userDao = require('../dao/userDao');
var dailiDao = require('../dao/dailiDao');

var enums = require('../consts/enums');
var Core = require('../base/Core');

module.exports = Core.obserData.extend({
    sync: null,
    synctime: null,
    inGame: null,
    logined: false,
    HallType: null, //当前大厅类型
    data: null,
    ctor: function () {
        this._super();
        this.data = {
            uid: null,
            nickname: null,
            gamename: null,
            sex: null,
            headimg: null,
            openid: null,

            fangka: null,
            money: null,

            robot: null,
            referee: null,

            _lockmoney: null,
            _lockfangka: null,

            daili: null,
            liushui: null,
        }
    },
    init: function (uid, next) {
        this.sync = [];
        this.inGame = [];
        this.logined = true;
        this.HallType = null;
        this.synctime = Date.parse(new Date()) / 1000;

        Object.defineProperty(this, "uid", {
            get: function () { return this.data.uid }
        });
        Object.defineProperty(this, "nickname", {
            get: function () { return this.data.nickname }
        });
        Object.defineProperty(this, "gamename", {
            get: function () { return this.data.gamename }
        });
        Object.defineProperty(this, "sex", {
            get: function () { return this.data.sex }
        });
        Object.defineProperty(this, "headimg", {
            get: function () { return this.data.headimg }
        });
        Object.defineProperty(this, "openid", {
            get: function () { return this.data.openid }
        });
        Object.defineProperty(this, "fangka", {
            get: function () { return this.data.fangka }
        });
        Object.defineProperty(this, "money", {
            get: function () { return this.data.money }
        });
        Object.defineProperty(this, "robot", {
            get: function () { return this.data.robot }
        });
        Object.defineProperty(this, "referee", {
            get: function () { return this.data.referee }
        });
        Object.defineProperty(this, "daili", {
            get: function () { return this.data.daili }
        });
        Object.defineProperty(this, "liushui", {
            get: function () { return this.data.liushui }
        });
        Object.defineProperty(this, "rvalue", {
            get: function () { return this.data.rvalue }
        });

        userDao.getInfo(uid, function (err, data) {
            if (!data) {
                logger.error("UID NOT EXIST:" + uid);
                next(true, null);
                return;
            }
            userDao.getMoney(uid, function (err, money) {
                if (!money) {
                    logger.error("MONEY nOT EXIST:" + uid);
                    next(true, null);
                    return;
                }
                dailiDao.getDaili(uid, function (err, daili) {
                    this.data.daili = daili;
                    dailiDao.getLiuShui(uid, function (err, liushui) {
                        this.data.uid = uid;
                        this.data.nickname = data.nickname;
                        this.data.gamename = data.gamename;
                        this.data.sex = data.sex;
                        this.data.headimg = data.headimg;
                        this.data.openid = data.openid;
                        this.data.robot = data.robot;
                        this.data.referee = data.referee;
                        this.data.rvalue = data.rvalue;
                        this.data.fangka = money.fangka;
                        this.data.money = money.money;
                        this.data.liushui = liushui;
                        this.data.mvalue = money.mvalue;
                        next(null, null);
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }.bind(this));
    },
    toJSON: function () {
        return { uid: this.uid, nickname: this.nickname, gamename: this.gamename, sex: this.sex, headimg: this.headimg, fangka: this.fangka, money: this.money, referee: this.referee };
    },
    lockMoney: function (m) {
        if (this.data.money < m) return false;
        this.data.money -= m;
        this.data._lockmoney += m;

        var l = parseInt(this.data.money * 100) / 100;
        this.data.money = l;
        l = parseInt(this.data._lockmoney * 100) / 100;
        this.data._lockmoney = l;
        return true;
    },
    unlockMoney: function (m, cm) {
        m = this.data._lockmoney > m ? m : this.data._lockmoney;
        this.data.money += m;
        this.data._lockmoney -= m;

        this.data.money += cm;

        var l = parseInt(this.data.money * 100) / 100;
        this.data.money = l;
        l = parseInt(this.data._lockmoney * 100) / 100;
        this.data._lockmoney = l;
        this.updateMoney();
    },
    lockFangka: function (f) {
        if (this.data.fangka < f) return false;
        this.data.fangka -= f;
        this.data._lockfangka += f;

        var l = parseInt(this.data.fangka * 100) / 100;
        this.data.fangka = l;
        l = parseInt(this.data._lockfangka * 100) / 100;
        this.data._lockfangka = l;
        return true;
    },
    unlockFangka: function (f, cf) {
        m = this.data._lockmoney > f ? f : this.data._lockmoney;
        this.data.fangka += f;
        this.data._lockfangka -= f;
        this.data.fangka += cf;
        var l = parseInt(this.data.fangka * 100) / 100;
        this.data.fangka = l;
        l = parseInt(this.data._lockfangka * 100) / 100;
        this.data._lockfangka = l;
        this.updateMoney();
    },
    updateMoney: function () {
        userDao.updateMoney(this.data.uid, this.data.fangka, this.data.money, function (err, res) {

        });
        var bFind = false;
        for (var key in this.sync) {
            if (this.sync[key].p == enums.PROTOCOL.MONEY_SYNC) {
                bFind = true;
                this.sync[key].msg = { money: this.data.money, fangka: this.data.fangka };
            }
        }
        if (!bFind) {
            this.sync.push({ p: enums.PROTOCOL.MONEY_SYNC, msg: { money: this.data.money, fangka: this.data.fangka } });
        }
    },
    addMsg: function (protocol, msg) {
        this.sync.push({ p: protocol, msg: msg });
    },
    ShowData: function () {
        return { uid: this.data.uid, nickname: this.data.nickname, gamename: this.data.gamename, sex: this.data.sex, headimg: this.data.headimg };
    },
    enterHall: function (hallid) {
        this.HallType = hallid;
    },
    leaveHall: function () {
        this.HallType = null;
    },
    reLogin: function () {
        this.sync = [];
        this.addMsg(enums.PROTOCOL.RELOGIN, {});
    },
    getSync: function () {
        var r = [];
        for (var key in this.sync) {
            console.warn(this.sync[key].p);
            r.push(this.sync[key]);
        }
        this.sync = [];

        return r;
    },
    setReferee: function (r) {
        this.data.referee = r;
        userDao.updateReferee(this.data.uid, this.data.referee, function () { });
    },
    setRvalue: function (r) {
        this.data.rvalue = r;
        userDao.updateRvalue(this.data.uid, this.data.rvalue, function () { });
    },
    addMvalue: function (v) {
        var realv = parseInt(v * 100000000);
        this.data.mvalue += realv;
        var tmpv = this.mvalue / 100000000;
        var i = parseInt(tmpv);

        this.data.money += i;
        this.updateMoney();

        this.data.mvalue = this.data.mvalue % 100000000;
        userDao.updaterv(this.data.uid, this.data.mvalue, function () { });
    },
    fafunc: function (u, v, l) {
        if (l > 3) return;
        Core.GData.checkUid(u, function (err, user) {
            if (!user) return;
            if (enums.R_INFO[user.rvalue] && enums.R_INFO[user.rvalue][l]) {
                var rv = enums.R_INFO[user.rvalue][l][0];
                var rvv = v * rv / 100;
                user.addMvalue(rvv);
                userDao.refereelog(this.data.uid, u, rvv);
                if (user.referee && user.referee != "") {
                    this.fafunc(user.referee, v, l + 1);

                }
            }
        }.bind(this));
    },
    faCalc: function (v) {
        if (!!this.data.referee && this.data.referee != "") {
            this.fafunc(this.data.referee, v, 1);
        }
    },
    qiangfunc: function (u, v, l) {
        if (l > 3) return;
        Core.GData.checkUid(u, function (err, user) {
            if (!user) return;
            if (enums.R_INFO[user.rvalue] && enums.R_INFO[user.rvalue][l]) {
                var rv = enums.R_INFO[user.rvalue][l][1];
                var rvv = v * rv / 100;
                user.addMvalue(rvv);
                userDao.refereelog(this.data.uid, u, rvv);
                if (user.referee && user.referee != "") {
                    this.qiangfunc(user.referee, v, l + 1);
                }
            }
        }.bind(this));
    },
    qiangCalc: function (v) {
        if (!!this.data.referee && this.data.referee != "") {
            this.qiangfunc(this.data.referee, v, 1);
        }
    }
});