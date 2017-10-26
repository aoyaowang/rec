var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var consts = require('../consts/consts');
var enums = require('../consts/enums');
var utils = require('../util/utils');
var mysql = require('mysql');
var async = require('async');
var sanitizer = require('sanitizer');

var userDao = module.exports;

userDao.getInfo = function(uid, next) {
    var sql = 'select * from user where uid = ?';
    var args = [sanitizer.sanitize(uid)];

    pomelo.app.get('db1').query(sql, args, function(err, res){
        if (!res) {
            next(null, null);
            return;
        }

        if (res.length > 0) {
            next(null, res[0]);
        } else {
            next(null, null);
        }
    });
}

userDao.getMoney = function(uid, next) {
    var sql = 'select * from money where uid = ?';
    var args = [sanitizer.sanitize(uid)];

    pomelo.app.get('db1').query(sql, args, function(err, res){
        if (!res) {
            next(null, null);
            return;
        }

        if (res.length > 0) {
            next(null, res[0]);
        } else {
            next(null, null);
        }
    });
};

userDao.updateMoney = function(uid, fangka, money, next) {
    var sql = 'update money set fangka = ?,money = ? where uid = ?';
    var args= [sanitizer.sanitize(fangka), sanitizer.sanitize(money), sanitizer.sanitize(uid)];

    pomelo.app.get('db1').query(sql, args, function(err, res){
        next(null, null);
    });
}

userDao.gamelog = function(uid, roomid, game, coin, money, time) {
    var sql = 'insert into gamelog (uid, roomid, game, coin, money, time) values (?, ?, ?, ?, ?, ?)';
    var args = [sanitizer.sanitize(uid), sanitizer.sanitize(roomid), sanitizer.sanitize(game), coin, money, time];

    pomelo.app.get('db1').query(sql, args, function(err, res){

    });
}

userDao.getLog = function(uid, type, next) {
    var sql = 'select * from gamelog where uid = ? and game = ?';
    var args = [sanitizer.sanitize(uid), sanitizer.sanitize(type)];

    pomelo.app.get('db1').query(sql, args, function(err, res){
        if (!res) {
            next(null, []);
            return;
        }
        next(null, res);
    });
}

userDao.existBill = function(billid, next) {
    var sql = 'select * from bill where billid = ? and bill = 0';
    var args = [sanitizer.sanitize(billid)];

    pomelo.app.get('db1').query(sql, args, function(err, res){
        if (!res) {
            next(null, null);
            return;
        }
        next(null, res);
    });
}

userDao.updateBill = function(billid, bill, next) {
    var sql = 'update bill set bill=?,time=? where billid = ?';
    var args = [parseInt(bill), Date.parse(new Date()) / 1000, sanitizer.sanitize(billid)];

    pomelo.app.get('db1').query(sql, args, function(err, res){
        next(null, null);
    });
}