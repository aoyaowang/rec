/**
 * Created by A on 2017/10/13.
 */
var crypto = require('../utils/crypto');
var express = require('express');
var db = require('../utils/db');
var http = require("../utils/http");
var Token = require("../utils/token");
var enums = require("../utils/enums");

var crypto = require("crypto");
var Buffer = require("buffer").Buffer;


function md5(data){
    var buf = new Buffer(data);
    var str = buf.toString("binary");
    return crypto.createHash("md5").update(str).digest("hex");
}

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
        appid:"wx1002e4f4a3b4b0bd",
        secret:"985e4c7b079f5e9bca11cd77cb0f535c",
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

function billsend(data,callback){
    http.post2("api.mch.weixin.qq.com","/pay/unifiedorder",data,callback,true);
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

app.get("/bill", function(req,res){
    var token = req.query.t;
    var m = parseInt(req.query.bill);
    if (token == null || m === null) {
        return;
    }
    m = parseInt(m);
    if (m < 0 || m > 99999999) {
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

        bill(uid, data.openid, m, res);
    });
}); 

function bill(uid, openid, m, cb) {
    var timestamp = Date.parse(new Date()) / 1000;
    console.warn("DD!!!!!!!!!!!!:");
    var trade_no = (new Date()).getTime() + randomWord(true, 4, 4);
    var map = {};
    map['appid'] = "wx1002e4f4a3b4b0bd";
    map['attach'] = uid;
    map['body'] = "充值";
    map['mch_id'] = "1484859142";
    map['nonce_str'] = randomWord(true, 20, 20);
    map["notify_url"] = "http://test.obyjd.com:20000/payback";
    map["openid"] = openid;
    map["out_trade_no"] = trade_no;
    map['spbill_create_ip'] = '127.0.0.1';
    map['total_fee'] = m*100;
    map['trade_type'] = 'JSAPI';
    console.warn("CC!!!!!!!!!!!!:");
    map = ksort(map);

    var signPars = '';
    for (var key in map) {
        if (map[key] != "" && key != "sign")
            signPars += key + '=' + map[key] + "&"; 
    }
    console.warn("BB!!!!!!!!!!!!:");
    signPars += "key=" + "fewafu23uNUInw1891nuiNu23895Amie";
    var md5sign = md5(signPars);
    map['sign'] = md5sign.toUpperCase();
    console.warn("AA！！！！！！！！:");
    var j = '<xml>' + json2xml(map, '') + '</xml>';
    console.warn("E:" + j);
    billsend(j, function(err, res){
        console.warn(JSON.stringify(res));
        res = res.toString();
        if (res.indexOf('<prepay_id><![CDATA[') >= 0 && res.indexOf('<return_code><![CDATA[SUCCESS]]></return_code>') >= 0) {
            db.insertBill(uid, trade_no, m, function(){
                var startx = res.indexOf('<prepay_id><![CDATA[') + '<prepay_id><![CDATA['.length;
                var endx = res.indexOf(']]></prepay_id>', startx);
                var st = res.substr(startx, endx - startx);
    
                var allmap = {
                    "appId":"wx1002e4f4a3b4b0bd",     //公众号名称，由商户传入     
                    "timeStamp":timestamp,         //时间戳，自1970年以来的秒数     
                    "nonceStr":randomWord(true, 20, 20), //随机串     
                    "package":"prepay_id="+st,     
                    "signType":"MD5"
                };
    
                allmap = ksort(allmap);
    
                var signPars2 = '';
                for (var key in allmap) {
                    if (allmap[key] != "" && key != "sign")
                        signPars2 += key + '=' + allmap[key] + "&"; 
                }
                signPars2 += "key=" + "fewafu23uNUInw1891nuiNu23895Amie";
                var md5sign2 = md5(signPars2);
                allmap['paySign'] = md5sign2.toUpperCase();
    
                send(cb, {code: 0, data: allmap});
            });
        } else {
            send(cb, {code: -1, data: res});
        }
    });
}

function randomWord(randomFlag, min, max, num){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		
	if (!!num) {
		arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	}

    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}

function ksort(inputArr, sort_flags) {  
  //  discuss at: http://phpjs.org/functions/ksort/  
  // original by: GeekFG (http://geekfg.blogspot.com)  
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)  
  // improved by: Brett Zamir (http://brett-zamir.me)  
  //        note: The examples are correct, this is a new way  
  //        note: This function deviates from PHP in returning a copy of the array instead  
  //        note: of acting by reference and returning true; this was necessary because  
  //        note: IE does not allow deleting and re-adding of properties without caching  
  //        note: of property position; you can set the ini of "phpjs.strictForIn" to true to  
  //        note: get the PHP behavior, but use this only if you are in an environment  
  //        note: such as Firefox extensions where for-in iteration order is fixed and true  
  //        note: property deletion is supported. Note that we intend to implement the PHP  
  //        note: behavior by default if IE ever does allow it; only gives shallow copy since  
  //        note: is by reference in PHP anyways  
  //        note: Since JS objects' keys are always strings, and (the  
  //        note: default) SORT_REGULAR flag distinguishes by key type,  
  //        note: if the content is a numeric string, we treat the  
  //        note: "original type" as numeric.  
  //  depends on: i18n_loc_get_default  
  //  depends on: strnatcmp  
  //   example 1: data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'};  
  //   example 1: data = ksort(data);  
  //   example 1: $result = data  
  //   returns 1: {a: 'orange', b: 'banana', c: 'apple', d: 'lemon'}  
  //   example 2: ini_set('phpjs.strictForIn', true);  
  //   example 2: data = {2: 'van', 3: 'Zonneveld', 1: 'Kevin'};  
  //   example 2: ksort(data);  
  //   example 2: $result = data  
  //   returns 2: {1: 'Kevin', 2: 'van', 3: 'Zonneveld'}  
  
  var tmp_arr = {},  
    keys = [],  
    sorter, i, k, that = this,  
    strictForIn = false,  
    populateArr = {};  
  
  switch (sort_flags) {  
  case 'SORT_STRING':  
    // compare items as strings  
    sorter = function (a, b) {  
      return that.strnatcmp(a, b);  
    };  
    break;  
  case 'SORT_LOCALE_STRING':  
    // compare items as strings, original by the current locale (set with  i18n_loc_set_default() as of PHP6)  
    var loc = this.i18n_loc_get_default();  
    sorter = this.php_js.i18nLocales[loc].sorting;  
    break;  
  case 'SORT_NUMERIC':  
    // compare items numerically  
    sorter = function (a, b) {  
      return ((a + 0) - (b + 0));  
    };  
    break;  
    // case 'SORT_REGULAR': // compare items normally (don't change types)  
  default:  
    sorter = function (a, b) {  
      var aFloat = parseFloat(a),  
        bFloat = parseFloat(b),  
        aNumeric = aFloat + '' === a,  
        bNumeric = bFloat + '' === b;  
      if (aNumeric && bNumeric) {  
        return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;  
      } else if (aNumeric && !bNumeric) {  
        return 1;  
      } else if (!aNumeric && bNumeric) {  
        return -1;  
      }  
      return a > b ? 1 : a < b ? -1 : 0;  
    };  
    break;  
  }  
  
  // Make a list of key names  
  for (k in inputArr) {  
    if (inputArr.hasOwnProperty(k)) {  
      keys.push(k);  
    }  
  }  
  keys.sort(sorter);  
  
  // BEGIN REDUNDANT  
  this.php_js = this.php_js || {};  
  this.php_js.ini = this.php_js.ini || {};  
  // END REDUNDANT  
  strictForIn = this.php_js.ini['phpjs.strictForIn'] && this.php_js.ini['phpjs.strictForIn'].local_value && this.php_js  
    .ini['phpjs.strictForIn'].local_value !== 'off';  
  populateArr = strictForIn ? inputArr : populateArr;  
  
  // Rebuild array with sorted key names  
  for (i = 0; i < keys.length; i++) {  
    k = keys[i];  
    tmp_arr[k] = inputArr[k];  
    if (strictForIn) {  
      delete inputArr[k];  
    }  
  }  
  for (i in tmp_arr) {  
    if (tmp_arr.hasOwnProperty(i)) {  
      populateArr[i] = tmp_arr[i];  
    }  
  }  
  
  return strictForIn || populateArr;  
}  

function json2xml(o, tab) {  
   var toXml = function(v, name, ind) {  
      var xml = "";  
      if (v instanceof Array) {  
         for (var i=0, n=v.length; i<n; i++)  
            xml += ind + toXml(v[i], name, ind+"\t") + "\n";  
      }  
      else if (typeof(v) == "object") {  
         var hasChild = false;  
         xml += ind + "<" + name;  
         for (var m in v) {  
            if (m.charAt(0) == "@")  
               xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";  
            else  
               hasChild = true;  
         }  
         xml += hasChild ? ">" : "/>";  
         if (hasChild) {  
            for (var m in v) {  
               if (m == "#text")  
                  xml += v[m];  
               else if (m == "#cdata")  
                  xml += "<![CDATA[" + v[m] + "]]>";  
               else if (m.charAt(0) != "@")  
                  xml += toXml(v[m], m, ind+"\t");  
            }  
            xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";  
         }  
      }  
      else {  
         xml += ind + "<" + name + ">" + "" + v.toString() + ""  +  "</" + name + ">";  
      }  
      return xml;  
   }, xml="";  
   for (var m in o)  
      xml += toXml(o[m], m, "");  
   return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");  
}