var http = require('http');
var url = require('url');
http.globalAgent.maxSockets = 4000;
var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require("pomelo");
var fs = require("fs");

var consts = require("../consts/consts");
var Token = require('../util/token');

var hallAddr = "";

function send(res,ret){
    var str = JSON.stringify(ret);
    res.send(str)
}

function getClientIp(req) {
	var ip = req.headers['x-forwarded-for'] ||
        (req.connection ? req.connection.remoteAddress : null) ||
        (req.socket ? req.socket.remoteAddress : null) ||
        (req.connection && req.connection.socket ? req.connection.socket.remoteAddress : "0.0.0.0");
    return ip;
};

function resultBack(res)
{
   return function(result)
   {
       res.setHeader("Access-Control-Allow-Origin", "*");
       res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
       res.setHeader("Access-Control-Allow-Headers", "Content-Type");
       res.setHeader("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
       res.writeHead(200, "OK", {'Content-Type': 'text/html'});
       res.end(JSON.stringify(result));

   }
};

function resultBackText(res)
{
   return function(result)
   {
       res.setHeader("Access-Control-Allow-Origin", "*");
       res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
       res.setHeader("Access-Control-Allow-Headers", "Content-Type");
       res.setHeader("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
       res.writeHead(200, "OK", {'Content-Type': 'text/html'});
       res.end(result);

   }
};

var mapAcc = {
    "admin": "123456"
};

var filePath = null;
var logct = 0;
var logct2 = 0;

exports.start = function(port){
    var svr = pomelo.app.getCurServer();

    filePath = process.cwd("");
    filePath+="/../Temp";
 
     fs.exists(filePath,function(exist)
     {
         if(!exist)
         {
             fs.mkdir(filePath, 0777, function(err)
             {
                 if(err){
                     console.log(err);
                 }else{
                     console.log("creat done!");
                 }
 
             });
         }
         else
         {
             console.log("dic is exist");
         }
     });

    var serverArgs = function(req, res){
        var urlInfo = url.parse(req.url,true);
        var reqInfo = urlInfo.query;
        var resback = resultBack(res);
        var ip = getClientIp(req);
        req.ClientIp = ip;

         var body = [];
         req.on('data', function (chunk) {
             body.push(chunk);
             if (body.toString().length > 5048000) {
                 req.end();
             }
         }) ;
         req.on('end', function () {
             if (!!req.isget) return;
             req.isget = 1;
             body = Buffer.concat(body) ;
             body = body.toString();
             if ("/login" === urlInfo.pathname) {
                 var acc = reqInfo.acc;
                 var pass = reqInfo.pass;
                if (!mapAcc[acc] || mapAcc[acc] != pass) {
                    resback({code: consts.NOR_CODE.FAILED});
                    return;
                }
                resback({code: consts.NOR_CODE.SUC_OK, data: Token.create(acc, Date.parse(new Date()) / 1000, "127.0.0.1", "GM")});
                 return;
             }

             /*var token = reqInfo.token;
             if (!token) {
                resback({code: consts.NOR_CODE.FAILED});
                return;
             }

             var ptoken = Token.parse(token, "GM");
             if (!ptoken) {
                resback({code: consts.NOR_CODE.FAILED});
                return;
             }*/

             if ("/getallrobot" === urlInfo.pathname)
             {
                 getallrobot(resback);
                return;
             }
             else if ("/configrobot" === urlInfo.pathname)
             {
                 var time1 = reqInfo.time1;
                 var time2 = reqInfo.time2;
                 var time3 = reqInfo.time3;
                 var game = reqInfo.game;
                 var param = reqInfo.param;
                 var uids = JSON.parse(reqInfo.uids);
                 configrobot(uids, game, param, time1, time2, time3, resback);
                 return;
             }
             else if ("/deleterobot" === urlInfo.pathname)
             {
                 var uids = JSON.parse(reqInfo.uids);
                 deleterobot(uids, resback);
                 return;
             }
             else if ("/deleterobot2" === urlInfo.pathname)
             {
                 var uids = JSON.parse(reqInfo.uids);
                 deleterobot2(uids, resback);
                 return;
             }
             else if ("/createrobot" === urlInfo.pathname)
             {
                 var info = JSON.parse(reqInfo.i);
                 createrobot(info, resback);
                 return;
             }
             else if ("/upscore" === urlInfo.pathname)
             {
                 var m = reqInfo.m;
                 var f = reqInfo.f;
                 var uids = reqInfo.uid;
                 upscore(uids, m, f, resback);
                 return;
             }
             else if ("/getalluser" === urlInfo.pathname)
             {
                 getalluser(resback);
                 return;
             }
             else if ("/setrvalue" === urlInfo.pathname)
             {
                var uids = JSON.parse(reqInfo.uids);
                var r = parseInt(reqInfo.r);
                setrvalue(uids, r, resback);
                return;
             }
             else if ("/setreferee" === urlInfo.pathname)
             {
                var uids = JSON.parse(reqInfo.uids);
                var r = reqInfo.r;
                setreferee(uids, r, resback);
                return;
             }
             else if ("/catch" === urlInfo.pathname)
             {
                 catchPay(req, body, resback);
                return;
             }
             else if ("/backmoney" === urlInfo.pathname)
             {
                console.warn("RECV backmoney: " + req.url);
                fs.writeFile(filePath+"/back" + (logct2++),"URL:" + req.url + "\r\nBODY" + body,function()
                {
                    cb(0);
                });
                return;
             }
             resback(0);
         });

        return;
    };
 
    server = http.createServer(serverArgs);
    server.listen(port);
    server.addListener("connection", function(socket){
        socket.setTimeout(15000);
    });
    console.warn("gm server is listening on " + (svr.port + 10000));
}

function getallrobot(cb) {
    pomelo.app.rpc.business.gameRemote.getallrobot(null, function(err, res){
        cb(res || {code: consts.NOR_CODE.FAILED});
    });
}

function configrobot(uids, game, param, time1, time2, time3, cb) {
    pomelo.app.rpc.business.gameRemote.configrobot(null, uids, game, param, time1, time2, time3, function(err, res){
        cb(res || {code: consts.NOR_CODE.FAILED});
    });
}

function deleterobot(uids, cb) {
    pomelo.app.rpc.business.gameRemote.deleterobot(null, uids, function(err, res){
        cb(res || {code: consts.NOR_CODE.FAILED});
    });
}

function deleterobot2(uids, cb) {
    pomelo.app.rpc.business.gameRemote.deleterobot2(null, uids, function(err, res){
        cb(res || {code: consts.NOR_CODE.FAILED});
    });
}

function createrobot(info, cb) {
    pomelo.app.rpc.business.gameRemote.createrobot(null, info, function(err, res){
        cb(res || {coode: consts.NOR_CODE.FAILED});
    });
}

function upscore(uids, m, f, cb) {
    pomelo.app.rpc.business.gameRemote.upscore(null, uids, m, f, function(err, res){
        cb(res || {coode: consts.NOR_CODE.FAILED});
    });
}

function getalluser(cb) {
    pomelo.app.rpc.business.gameRemote.getAllUser(null, function(err, res){
        cb(res || {coode: consts.NOR_CODE.FAILED});
    });
}

function setrvalue(uids, r, cb) {
    pomelo.app.rpc.business.gameRemote.setRvalue(null, uids, r, function(err, res){
        cb(res || {coode: consts.NOR_CODE.FAILED});
    });
}

function setreferee(uids, r, cb) {
    pomelo.app.rpc.business.gameRemote.setreferee(null, uids, r, function(err, res){
        cb(res || {coode: consts.NOR_CODE.FAILED});
    });
}

var pay = require("../util/pay/pay");
var crypto = require('crypto');
var privateKey = "-----BEGIN RSA PRIVATE KEY-----\
MIICeQIBADANBgkqhkiG9w0BAQEFAASCAmMwggJfAgEAAoGBANqTs4i+/FXjgMzf\
ZgpRahhrg83bWCIjCRxH4tPDmctGEByoDYpeWueE92ENZH8Wmq/t5bv0Cnti/P65\
cZ43KA9fp0Q5z3Dg4gpZBa4Mgi/T446a/nGji+W2SXJwl+MteuDclRxl2XkR8QF6\
7/Ex3a3jzCz4+Syy6i6mObQ4CVg5AgMBAAECgYEA1yv33XJF7jdcIFL7nMSw8QFG\
a2y2wkRDP7f0sAsqZ1W9nrhBPCnOy4O2E7CfcgzKks5bDkAb4YN9EzVziBE8OLNz\
0xdVGCErjD5LxWXF7NF0zu2CKiCA42f+czMgbN7L0ioAuiJmpRES18WSNwPGQLNU\
/LfyNluWkjgTt8Z21gECQQD8elGRsRh2MlEpN1roH1vvYx12Yc6yXK2X3OlTQcq2\
Az5fhT6J6hfeXMYpl526L5ulywJ2C+aZMEGEt+a4NFwJAkEA3aBPw/EEWXdvgF9R\
JumSK0C22AJUffEIb43u/axP/XjeciFrqc7gOfnPMiH6VpDdZd5PlbUsRQFwQU6R\
gqGGsQJBAJA8UN0qjw73L+ab+RMi1yKrPOmkdrDuwT1AtwsZSvUwZTGsrU2croYZ\
+htIwpLbH9BXadCGe/aH2uY3KVeSkgECQQDM+Yjsewv/xvPsMbv3lkznDgpNzBHj\
DTs1GXtxSJ4Om2x4+CoAOmKtnDqibkR/Lapmne7TUmXoSIVPEWCJBeVxAkEA7K2i\
vJ/+3vhm8fHwNFgc8YN9wIri5VpRPWwWzGGdqONgDVikDB5Tpx2HJMdxIBNngKkl\
GwVibmj1dTsVf0fKFQ==\
-----END RSA PRIVATE KEY-----";

//时间日期转换成string
function data_string(str, value) {
    if (value == "yyyy-MM-dd hh:mm:ss") {
        var d = new Date(str * 1000);
        var ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
        for (var i = 0; i < ar_date.length; i++) ar_date[i] = dFormat(ar_date[i]);
        return ar_date.slice(0, 3).join('-') + ' ' + ar_date.slice(3).join(':');
        function dFormat(i) { return i < 10 ? "0" + i.toString() : i; }
    }
    else if (value == "yyyy-MM-dd") {
        var d = new Date(str * 1000);
        var ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
        for (var i = 0; i < ar_date.length; i++) ar_date[i] = dFormat(ar_date[i]);
        return ar_date.join('-');
        function dFormat(i) { return i < 10 ? "0" + i.toString() : i; }
    }
    else if (value == "yyyyMMddhhmmss") {
        var d = new Date(str * 1000);
        var ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
        for (var i = 0; i < ar_date.length; i++) ar_date[i] = dFormat(ar_date[i]);
        return ar_date.slice(0, 3) + ar_date.slice(3);
        function dFormat(i) { return i < 10 ? "0" + i.toString() : i; }
    }
}

function catchPay(req, body, cb) {
    fs.writeFile(filePath+"/log" + (logct++),"URL:" + req.url + "\r\nBODY" + body,function()
    {
        cb(0);
    });

    var recvMap = {};
    var tmpay = body.split('&');
    for (var k in tmpay) {
        var tmpay2 = tmpay[k].split('=');
        recvMap[tmpay2[0]] = decodeURI(tmpay2[1]);
    }

    var tardestate = recvMap['trade_status'];
    var tardeno = recvMap['trade_no'];
    var totalfee = recvMap['total_fee'];
    pay.payCall(body, function(err, data){

        if (tardestate == 'TRADE_SUCCESS') {
            var reqMap = {};
            reqMap['service'] = 'refund_fastpay_by_platform_pwd';
            reqMap['partner'] = '2088221385614385';
            reqMap['_input_charset'] = "utf-8";
            reqMap['notify_url'] = 'http://120.92.148.83:9800/backmoney';
            reqMap['seller_email'] = 'admin@33178.com';
            reqMap['refund_date'] = data_string(Date.parse(new Date()) / 1000, "yyyy-MM-dd hh:mm:ss");
            reqMap['batch_no'] = data_string(Date.parse(new Date()) / 1000, "yyyyMMddhhmmss");
            reqMap['batch_num'] = 1;
            reqMap['detail_data'] = tardeno.toString() + totalfee.toString() + "协商退款";
            reqMap = ksort(reqMap);
            var signPars = '';
            for (var key in reqMap) {
                if (reqMap[key] != "" && key != "sign")
                    signPars += key + '=' + encodeURI(reqMap[key]) + "&"; 
            }
            signPars = signPars.substr(0, signPars.length - 1);

            
            var sign = crypto.createSign('RSA-SHA1');
            sign.update(signPars,'utf8');
            var outs = sign.sign(privateKey, 'base64');
        }
    });
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