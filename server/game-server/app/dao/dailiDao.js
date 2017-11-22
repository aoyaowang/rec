var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var consts = require('../consts/consts');
var enums = require('../consts/enums');
var utils = require('../util/utils');
var mysql = require('mysql');
var async = require('async');
var sanitizer = require('sanitizer');

var dailiDao = module.exports;

dailiDao.getLiuShui = function(uid, next) {
    var sql = 'select * from liushui where uid = ?';
    var args = [sanitizer.sanitize(uid)];

    pomelo.app.get('db1').query(sql, args, function(err, data){
        if (!data || data.length == 0) {
            next(null, 0);
        }
        else {
            next(null, data[0]['value']);
        }
    });
}

dailiDao.updateLiuShui = function(uid, value, next) {
    var sql = 'replace into liushui(uid, value) values (?, ?)';
    var args = [sanitizer.sanitize(uid), value];

    pomelo.app.get('db1').query(sql, args, function(err, res){
        next(null, null);
    });
}

dailiDao.getDaili = function(uid, next) {
    var sql = 'select * from daili where uid = ?';
    var args = [uid];

    pomelo.app.get('db1').query(sql, args, function(err, res){
        if (!res || res.length == 0) {
            next(null, null);
        } else {
            next(null, res[0]);
        }
    });
}

dailiDao.update = function(uid, lv, time, setting, next) {
    var sql = 'replace into daili(uid, lv, time, setting) values (?,?,?,?)';
    var args = [uid, lv, time, sanitizer.sanitize(setting)];

    pomelo.app.get('db1').query(sql, args, function(err, res){
        next(null, null);
    });
}