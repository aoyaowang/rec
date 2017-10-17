/**
 * Created by A on 2017/10/13.
 */
var crypto = require('../utils/crypto');
var express = require('express');
var db = require('../utils/db');
var http = require("../utils/http");
var Token = require("../utils/token");
var enums = require("../utils/enums");

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err);
});

var app = express();
var hallAddr = "";

var m_db = {};

function send(res,ret){
    var str = JSON.stringify(ret);
    res.send(str)
}

function getClientIp(req) {
        return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}

function updateUser(data) {
    if (!m_db[data.uid]) m_db[data.uid] = {};
    var timestamp = Date.parse(new Date()) / 1000;
    m_db[data.uid].time = timestamp;
    m_db[data.uid].data = data;
    delete m_db[data.uid].fangka;
    delete m_db[data.uid].money;
    delete m_db[data.uid].token;
    delete m_db[data.uid].openid;
}

var config = null;
var TOKEN_SECRET = "";
exports.start = function(cfg){
    config = cfg;
    TOKEN_SECRET = config.TOKEN_SECRET;
    hallAddr = config.SERVER_IP  + ":" + config.CLIENT_PORT;
    app.listen(config.CLIENT_PORT);
    console.log("login server is listening on " + config.CLIENT_PORT);
}

function getGate(uid){
    var srvs = config.SERVERS;
    var a = srvs[parseInt(uid)%srvs.length];
    return "http://" + a.IP + ":" + a.port + "/";
}

//���ÿ������
app.all('*', function(req, res, next) {
    req.ip = getClientIp(req);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/get_version',function(req,res){
    var ret = {
        version:config.VERSION,
    }
    send(res,ret);
});

app.get('/get_serverinfo',function(req,res){
    var ret = {
        version:config.VERSION,
        hall:hallAddr,
        appweb:config.APP_WEB,
    }
    send(res,ret);
});

var appInfo = {
    Android:{
        appid:"wxe39f08522d35c80c",
        secret:"fa88e3a3ca5a11b06499902cea4b9c01",
    },
    iOS:{
        appid:"wxcb508816c5c4e2a4",
        secret:"7de38489ede63089269e3410d5905038",
    },
    WEB:{
        appid:"wx521ac03928cf7966",
        secret:"6c94d4b4509381694b78d4aff723e960",
    }
};

function get_access_token(code,os,callback){
    var info = appInfo[os];
    if(info == null){
        callback(false,null);
    }
    var data = {
        appid:info.appid,
        secret:info.secret,
        code:code,
        grant_type:"authorization_code"
    };

    http.get2("https://api.weixin.qq.com/sns/oauth2/access_token",data,callback,true);
}

function get_state_info(access_token,openid,callback){
    var data = {
        access_token:access_token,
        openid:openid
    };

    http.get2("https://api.weixin.qq.com/sns/userinfo",data,callback,true);
}

app.get("/tokenlogin", function(req,res){
    var token = req.query.t;
    if (token == null) {
        return;
    }
    var t = Token.parse(token, TOKEN_SECRET);
    var timestamp = Date.parse(new Date()) / 1000;
    if (timestamp - t.timestamp > enums.TOKEN.TIME) {
        send(res, {code: enums.CODE.TOKEN_TIMEOUT});
        return;
    }

    var uid = t.uid;
    db.is_uid_exist(uid, function(data){
        if (!data) {
            console.error("UID NOT EXIST:" + uid);
            send(res, {code: enums.CODE.FAILED});
            return;
        }
        if (data.vaild > t.timestamp) {
            send(res, {code: enums.CODE.TOKEN_TIMEOUT});
            return;
        }
        db.get_money(uid, function(money){
            var token = Token.create(uid, timestamp, req.ip, TOKEN_SECRET);
            var ret = {
                code: 0,
                data:{
                    uid: data.uid,
                    nickname: data.nickname,
                    gamename: data.gamename,
                    sex: data.sex,
                    headimg: data.headimg,

                    fangka: money.fangka,
                    money: money.money,
                    token: token,
                    gate: getGate(uid)
                }
            }
            send(res, ret);
            updateUser(ret.data);
        });
    });
}); 

app.get('/wechat_auth',function(req,res){
    var code = req.query.code;
    var os = req.query.os||"WEB";
    if(code == null || code == "" || os == null || os == ""){
        return;
    }
    var timestamp = Date.parse(new Date()) / 1000;
    get_access_token(code,os,function(suc,data){
        if(data){
            var access_token = data.access_token;
            var openid = data.openid;
            get_state_info(access_token,openid,function(suc2,data2){
                if(suc2){
                    console.log(suc + ":" + JSON.stringify(data2));
                    var openid = data2.openid;
                    var nickname = data2.nickname;
                    var sex = data2.sex;
                    var headimgurl = data2.headimgurl;
                    var account = "wx_" + openid;
                    db.is_openid_exist(openid, function(data){
                        if (!data) {
                            db.create_user(openid, nickname, sex, headimgurl, function(uid){
                                if (!uid) {
                                    console.error("????????:" + nickname + " OPENID:" + openid);
                                } else {
                                    var token = Token.create(uid, timestamp, req.ip, TOKEN_SECRET);
                                    var ret = {
                                        code:0,
                                        data:{
                                            uid: uid,
                                            nickname: nickname,
                                            gamename: "",
                                            sex: sex,
                                            headimg: headimgurl,

                                            fangka: 0,
                                            money: 0,
                                            token: token,
                                            gate: getGate(uid)
                                        }
                                    }
                                    send(res, ret);
                                    updateUser(ret.data);
                                }
                            });
                        } else {
                            db.update_user(openid, nickname, sex, headimgurl, function(){
                                db.get_money(data.uid, function(money){
                                    var token = Token.create(data.uid, timestamp, req.ip, TOKEN_SECRET);
                                    var ret = {
                                        code: 0,
                                        data:{
                                            uid: data.uid,
                                            nickname: nickname,
                                            gamename: data.gamename,
                                            sex: sex,
                                            headimg: headimgurl,

                                            fangka: money.fangka,
                                            money: money.money,
                                            token: token,
                                            gate: getGate(data.uid)
                                        }
                                    }
                                    send(res, ret);
                                    updateUser(ret.data);
                                });
                            });
                        }
                    });
                    //create_user(account,nickname,sex,headimgurl,function(){
                    //    var sign = crypto.md5(account + req.ip + config.ACCOUNT_PRI_KEY);
                    //    var ret = {
                    //        errcode:0,
                    //        errmsg:"ok",
                    //        account:account,
                    //        halladdr:hallAddr,
                    //        sign:sign
                    //    };
                    //    send(res,ret);
                    //});
                }
            });
        }
        else{
            send(res,{errcode:-1,errmsg:"unkown err."});
        }
    });
});

app.get("/getinfo", function(req, res){
    var uid = req.query.uid;
    if (uid == null) {
        return;
    }
    var timestamp = Date.parse(new Date()) / 1000;
    if (!!m_db[uid]) {
        send(res, {code: enums.CODE.SUC_OK, data: m_db[uid].data});
        m_db[uid].time = timestamp;
        return;
    }

    db.is_uid_exist(uid, function(data){
        if (!data) {
            send(res, {code: enums.CODE.ERR_PARAM});
            return;
        }

        updateUser(ret.data);
        send(res, {code: enums.CODE.SUC_OK, data: res.data});
    });
});

app.get("/getlog", function(req, res){
    var t = req.query.token;
    if (t == null) {
        return;
    }

    var game = parseInt(req.query.game);
    db.getLog(uid, game, function(data){
        if (!data) {
            send(res, {code: consts.CODE.ERR_PARAM});
            return;
        }

        send(res, {code: enums.CODE.SUC_OK, data: data});
    });
});