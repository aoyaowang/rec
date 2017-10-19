var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var async = require('async');
var fs = require('fs');
var userDao = require('../dao/userDao');

var enums = require('../consts/enums');
var Core = require('../base/Core');

module.exports = {
    sync:null,
    synctime:null,
    inGame:null,
    logined: false,
    HallType: null, //当前大厅类型
    data: {
        uid: null,
        nickname: null,
        gamename: null,
        sex: null,
        headimg: null,
        openid: null,

        fangka: null,
        money: null,

        _lockmoney: null,
        _lockfangka: null,
    },
    init:function(uid, next) {
        this.sync = [];
        this.inGame = [];
        this.logined = true;
        this.HallType = null;
        this.synctime = Date.parse(new Date()) / 1000;
        userDao.getInfo(uid, function(err, data){
            if (!data) {
                logger.error("UID NOT EXIST:" + uid);
                next(true, null);
                return;
            }
            userDao.getMoney(uid, function(err, money){
                if (!money) {
                    logger.error("MONEY nOT EXIST:" + uid);
                    next(true, null);
                    return;
                }
                this.data.uid = uid;
                this.data.nickname = data.nickname;
                this.data.gamename = data.gamename;
                this.data.sex = data.sex;
                this.data.headimg = data.headimg;
                this.data.openid = data.openid;
                this.data.fangka = money.fangka;
                this.data.money = money.money;
                next(null, null);
            }.bind(this));
        }.bind(this));
    },
    lockMoney:function(m) {
        if (this.data.money < m) return false;
        this.data.money -= m;
        this.data._lockmoney += m;
        return true;
    },
    unlockMoney:function(m, cm) {
        this.data.money += m;
        this.data._lockmoney -= m;

        this.data.money += cm;
        this.updateMoney();
    },
    lockFangka:function(f) {
        if (this.data.fangka < f) return false;
        this.data.fangka -= f;
        this.data._lockfangka += f;
        return true;
    },
    unlockFangka:function(f, cf) {
        this.data.fangka += f;
        this.data._lockfangka -= f;
        this.data.fangka += cf;
        this.updateMoney();
    },
    updateMoney:function() {
        userDao.updateMoney(this.data.uid, this.data.fangka, this.data.money, function(err, res){

        });
        var bFind = false;
        for (var key in this.sync) {
            if (this.sync[key].p == enums.PROTOCOL.MONEY_SYNC) {
                bFind = true;
                this.sync[key].msg = {money: this.data.money, fangka: this.data.fangka};
            }
        }
        if (!bFind) {
            this.sync.push({p: enums.PROTOCOL.MONEY_SYNC, money: this.data.money, fangka: this.data.fangka});
        }
    },
    addMsg:function(protocol, msg) {
        this.sync.push({p: portocol, msg: msg});
    },
    ShowData:function(){
        return {uid: this.data.uid, nickname: this.data.nickname, gamename: this.data.gamename, sex: this.data.sex, headimg: this.data.headimg};
    },
    enterHall:function(hallid) {
        this.HallType = hallid;
    },
    leaveHall:function(){
        this.HallType = null;
    },
    reLogin:function() {
        this.sync = [];
        this.addMsg(enums.PROTOCOL.RELOGIN, {});
    },
    getSync:function() {
        var r = this.sync;
        this.sync = [];
        return r;
    }
};