var mysql=require("mysql");  
var crypto = require('./crypto');
var sanitizer = require('sanitizer');

var pool = null;

function nop(a,b,c,d,e,f,g){

}
  
function query(sql,args,callback){  
    pool.getConnection(function(err,conn){  
        if(err){  
            callback(err,null,null);  
        }else{ 
            conn.query(sql,args,function(qerr,vals,fields){  
                if (qerr) {
                    console.error(sql + ":" + JSON.stringify(args) + " " + JSON.stringify(qerr));
                }
                //释放连接  
                conn.release();  
                //事件驱动回调  
                callback(qerr,vals,fields);  
            });  
        }  
    });  
};

var db = exports;

db.init = function(config){
    pool = mysql.createPool({  
        host: config.HOST,
        user: config.USER,
        password: config.PSWD,
        database: config.DB,
        port: config.PORT,
    });
};

/*
exports.is_account_exist = function(account,callback){
    callback = callback == null? nop:callback;
    if(account == null){
        callback(false);
        return;
    }

    var sql = 'SELECT * FROM t_accounts WHERE account = "' + account + '"';
    query(sql, function(err, rows, fields) {
        if (err) {
            callback(false);
            throw err;
        }
        else{
            if(rows.length > 0){
                callback(true);
            }
            else{
                callback(false);
            }
        }
    });
};
*/

db.is_uid_exist = function(uid, cb) {
    cb = cb == null ? nop:cb;
    if (uid == null) {
        cb(false);
        return;
    }

    var sql = 'select * from user where uid = ?';
    var args = [sanitizer.sanitize(uid)];

    query(sql, args, function(err, res){
        if (err) {
            cb(false);
            throw err;
        }
        else{
            if(res.length > 0){
                cb(res[0]);
            }
            else{
                cb(false);
            }
        }
    });
}

db.is_openid_exist = function(openid, cb) {
    cb = cb == null ? nop:cb;
    if (openid == null) {
        cb(false);
        return;
    }

    var sql = 'select * from user where openid = ?';
    var args = [sanitizer.sanitize(openid)];

    query(sql, args, function(err, res){
        if (err) {
            cb(false);
            throw err;
        }
        else{
            if(res.length > 0){
                cb(res[0]);
            }
            else{
                cb(false);
            }
        }
    });
}

db.is_phone_exist = function(phone, cb) {
    cb = cb == null ? nop:cb;
    if (phone == null) {
        cb(false);
        return;
    }

    var sql = 'select * from user where phone = ?';
    var args = [sanitizer.sanitize(phone)];

    query(sql, args, function(err, res){
        if (err) {
            cb(false);
            throw err;
        }
        else{
            if(res.length > 0){
                cb(res[0]);
            }
            else{
                cb(false);
            }
        }
    });
}

db.get_money = function(uid, cb) {
    cb = cb == null ? nop : cb;
    var sql = 'select * from money where uid = ?';
    var args = [sanitizer.sanitize(uid)];

    query(sql, args, function(err, res){
        if (err) {
            cb(false);
            throw err;
        } else {
            if (res.length > 0) {
                cb(res[0]);
            } else {
                cb(false);
            }
        }
    });
}

db.create_user = function(openid, nickname, sex, headimg, cb) {
    cb = cb == null ? nop : cb;

    var sql = 'insert into user(openid, nickname, gamename, sex, headimg) values (?, ?, "", ?, ?)';
    var args = [sanitizer.sanitize(openid), sanitizer.sanitize(nickname), sanitizer.sanitize(nickname), sanitizer.sanitize(sex), sanitizer.sanitize(headimg || "")];

    query(sql, args, function(err, res){
        if (err) {
            cb(false);
            throw err;
        } else {
            var uid = res.insertId;
            var sql = 'insert into money(uid) values (?)';
            var args = [sanitizer.sanitize(uid)];

            query(sql, args, function(err, res){
                if (err) {
                    cb(false);
                    throw err;
                } else {
                    cb(uid);
                }
            });
        }
    });
}

db.update_user = function(openid, nickname, sex, headimg, cb) {
    var sql = 'update user set nickname=?,sex=?,headimg=? where openid = ?';
    var args = [sanitizer.sanitize(nickname), sanitizer.sanitize(sex), sanitizer.sanitize(headimg), sanitizer.sanitize(openid)];

    query(sql, args, function(err, res){
        if (err) {
            cb(false);
            throw err;
        } else {
            cb(true);
        }
    });
}

db.getLog = function(uid, game, cb) {
    var sql = 'select * from gamelog where uid = ? and game = ?';
    var args = [sanitizer.sanitize(uid), sanitizer.sanitize(game)];

    query(sql, args, function(err, res){
        if (err) {
            cb(false);
            throw err;
        } else {
            cb(res || []);
        }
    });
}

db.insertBill = function(uid, billid, bill, cb) {
    var sql = 'insert into bill(uid, billid, bill, time) values (?, ?, ?, ?)';
    var args = [sanitizer.sanitize(uid), sanitizer.sanitize(billid), 0, Date.parse(new Date()) / 1000];

    query(sql, args, function(err, res){
        if (err) {
            cb(false);
            throw err;
        } else {
            cb(null);
        }
    });
}

db.query = query;