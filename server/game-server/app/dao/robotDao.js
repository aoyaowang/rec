var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var consts = require('../consts/consts');
var enums = require('../consts/enums');
var utils = require('../util/utils');
var mysql = require('mysql');
var async = require('async');
var sanitizer = require('sanitizer');

var robotDao = module.exports;

robotDao.getAll = function(next) {
    var sql = 'select * from robot';
    var args = [];

    pomelo.app.get('db1').query(sql, args, function(err, res){
        if (!res) {
            next(null, []);
            return;
        }
        next(null, res);
    });
}

robotDao.robot = function(ay, next) {
    var sql = 'replace into robot (uid,game,time1,time2,time3,param) values';
    var args = [];

    var ct = 0;
    for (var key in ay) {
        var a = ay[key];
        if (ct != 0) sql += ',';
        sql += '(?,?,?,?,?,?)';
        ct++;
        args.push(a.uid, parseInt(a.game), 
                    sanitizer.sanitize(a.time1 || ''), 
                    sanitizer.sanitize(a.time2 || ''), 
                    sanitizer.sanitize(a.time3 || ''), 
                    sanitizer.sanitize(a.param || ''));
    }

    pomelo.app.get('db1').query(sql, args, function(err, res){
        next(null, null);
    });
}

robotDao.delete = function(uid, next) {
    var sql = 'delete from robot where uid = ?';
    var args = [uid];

    pomelo.app.get('db1').query(sql, args, function(err, res){
        next(null, null);
    });
}