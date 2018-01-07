var http = require('http');
var url = require('url');
http.globalAgent.maxSockets = 4000;
var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require("pomelo");

var consts = require("../consts/consts");

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

exports.start = function(port){
    var svr = pomelo.app.getCurServer();

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

             if ("/enter" === urlInfo.pathname)
             {
                 var t = reqInfo.t;
                 enter(t, resback);
                 return;
             }
             else if ("/sync" === urlInfo.pathname)
             {
                var t = reqInfo.t;
                sync(t, resback);
                return;
             }
             else if ("/gethallinfo" === urlInfo.pathname)
             {
                var t = reqInfo.t;
                var id = reqInfo.id;
                getHall(t, id, resback);
                return;
             }
             else if ("/joinroom" === urlInfo.pathname)
             {
                 var t = reqInfo.t;
                 var id = reqInfo.id;
                 var type = reqInfo.type;
                 joinroom(t, id, type, resback);
                 return;
             }
             else if ("/leaveroom" === urlInfo.pathname)
             {
                var t = reqInfo.t;
                leaveroom(t, resback);
                return;
             }
             else if ("/createsaolei" === urlInfo.pathname)
             {
                 var t = reqInfo.t;
                 var type = reqInfo.type;
                 var coin = parseInt(reqInfo.coin);
                 var num = parseInt(reqInfo.num);
                 var bomb = parseInt(reqInfo.bomb);
                 createsaolei(t, type, coin, num, bomb, resback);
                 return;
             }
             else if ("/saoleiQiang" === urlInfo.pathname)
             {
                 var t = reqInfo.t;
                 var h = reqInfo.h;
                 var r = reqInfo.r;
                 saoleiQiang(t, h, r, resback);
                 return;
             }
             else if ("/createjielong" === urlInfo.pathname)
             {
                 var t = reqInfo.t;
                 var type = reqInfo.type;
                 var coin = parseInt(reqInfo.coin);
                 createjielong(t, type, coin, resback);
                 return;
             }
             else if ("/createniuniu" === urlInfo.pathname)
             {
                 var t = reqInfo.t;
                 var type = reqInfo.type;
                 var coin = parseInt(reqInfo.coin);
                 createniuniu(t, type, coin, resback);
                 return;
             }
            else if ("/create28" === urlInfo.pathname)
             {
                 var t = reqInfo.t;
                 var type = reqInfo.type;
                 var coin = parseInt(reqInfo.coin);
                 create28(t, type, coin, resback);
                 return;
             }
             else if ("/getdetail" === urlInfo.pathname)
             {
                 var t = reqInfo.t;
                 var h = reqInfo.h;
                 var r = reqInfo.r;
                 getDetail(t, h, r, resback);
                 return;
             }
             else if ("/payback" === urlInfo.pathname)
             {
                //console.warn("payback:" + JSON.stringify(body) + "------" + JSON.stringify(reqInfo));
                payback(body, resultBackText(res));
                return;
             }
             else if ("/paybackfk" === urlInfo.pathname)
             {
                //console.warn("payback:" + JSON.stringify(body) + "------" + JSON.stringify(reqInfo));
                paybackfk(body, resultBackText(res));
                return;
             }
             else if ("/turnto" === urlInfo.pathname)
             {
                 var t = reqInfo.t;
                 var uid = reqInfo.uid;
                 var m = reqInfo.m;
                 turnto(t, uid, m, resback);
                 return;
             }
             else if ("/setreferee" === urlInfo.pathname)
             {
                 var r = reqInfo.r;
                 var t = reqInfo.t;
                 setreferee(t, r, resback);
                 return;
             }
             resback(0);
         });

        return;
    };
 
    server = http.createServer(serverArgs);
    server.listen(svr.port + 10000);
    server.addListener("connection", function(socket){
        socket.setTimeout(15000);
    });
    console.warn("gate server is listening on " + (svr.port + 10000));
}

function enter(t, cb) {
    pomelo.app.rpc.business.gameRemote.userEnter(null, t, function(err, res){
        cb(res || {code: consts.NOR_CODE.FAILED});
    })
}

function sync(t, cb) {
    pomelo.app.rpc.business.gameRemote.userSync(null, t, function(err, res){
        cb(res || {code: consts.NOR_CODE.FAILED});
    })
}

function getHall(t, id, cb) {
    pomelo.app.rpc.business.gameRemote.getHallInfo(null, t, id, function(err, res){
        cb(res || {code: consts.NOR_CODE.FAILED});
    });
}

function joinroom(t, id, type, cb) {
    pomelo.app.rpc.business.gameRemote.getRooms(null, t, id, type, function(err, res){
        cb(res || {code: consts.NOR_CODE.FAILED});
    });
}

function leaveroom(t, cb) {
    pomelo.app.rpc.business.gameRemote.leaveHall(null, t, function(err, res){
        cb(res || {code: consts.NOR_CODE.FAILED});
    });
}

function createsaolei(t, type, coin, num, bomb, cb) {
    var room = {
        type: type,
        coin: coin,
        num: num,
        bomb: bomb
    };
    pomelo.app.rpc.business.gameRemote.createRoom(null, t, room, function(err, res){
        cb(res || {code: consts.NOR_CODE.FAILED});
    });
}

function saoleiQiang(t, h, r, cb) {
    pomelo.app.rpc.business.gameRemote.saoleiQiang(null, t, h, r, function(err, res){
        cb(res || {code: consts.NOR_CODE.FAILED});
    });
}

function createjielong(t, type, coin, cb) {
    var room = {
        type: type,
        coin: coin
    };
    pomelo.app.rpc.business.gameRemote.createRoom(null, t, room, function(err, res){
        cb(res || {code: consts.NOR_CODE.FAILED});
    })
}

function createniuniu(t, type, coin, cb) {
    var room = {
        type: type,
        coin: coin
    };
    pomelo.app.rpc.business.gameRemote.createRoom(null, t, room, function(err, res){
        cb(res || {code: consts.NOR_CODE.FAILED});
    });
}

function create28(t, type, coin, cb) {
    var room = {
        type: type,
        coin: coin
    };
    pomelo.app.rpc.business.gameRemote.createRoom(null, t, room, function(err, res){
        cb(res || {code: consts.NOR_CODE.FAILED});
    });
}

function getDetail(t, h, r, cb) {
    pomelo.app.rpc.business.gameRemote.getDetail(null, t, h, r, function(err, res){
        cb(res || {code: consts.NOR_CODE.FAILED});
    });
}

function turnto(t, uid, money, cb) {
    pomelo.app.rpc.business.gameRemote.turnto(null, t, uid, money, function(err, res){
        cb(res || {code: consts.NOR_CODE.FAILED});
    });
}

function setreferee(t, r, cb) {
    pomelo.app.rpc.business.gameRemote.setReferee(null, t, r, function(err, res){
        cb(res || {code: consts.NOR_CODE.FAILED});
    });
}

function findAllKey(body) {
    var json = {};
    var index = 0;
    var cl = '><![CDATA['.length;
    while(index < body.length) {
        var en = body.indexOf('><![CDATA[', index);
        if (en >= 0) {
            var sn = 0;
            for (var k = en; k >= 0;k--) {
                if (body[k] == '<') {
                    sn = k;
                    break;
                }
            }
            var key = body.substr(sn + 1, en - sn - 1);
            index = body.indexOf(']]></'+key+'>', en);
            var value = body.substr(en + cl, index - en - cl);
            json[key] = value;
        } else {
            index = body.length;
        }
    }
    return json;
}

function payback(body, cb) {
    var json = findAllKey(body);
    if (!json) {
        cb("<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[OK]]></return_mg></xml>");
        return;
    }
    if (json['return_code'] != 'SUCCESS') {
        cb("<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_mg></xml>");
        return;
    }

    var allmap = ksort(json);
    var signPars = '';
    for (var key in allmap) {
        if (allmap[key] != "" && key != "sign")
            signPars += key + '=' + allmap[key] + "&"; 
    }
    signPars += "key=" + "fewafu23uNUInw1891nuiNu23895Amie";
    var md5sign = md5(signPars);

    if (md5sign.toUpperCase() == allmap['sign'].toUpperCase()) {
        cb("<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[OK]]></return_mg></xml>");
        return;
    }

    var fee = parseInt(json['cash_fee'])/100;
    var attach = json['attach'];

    pomelo.app.rpc.business.gameRemote.bill(null, attach, fee, function(err, res){
        cb("<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_mg></xml>");
        return;
    });
}

function paybackfk(body, cb) {
    var json = findAllKey(body);
    if (!json) {
        cb("<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[OK]]></return_mg></xml>");
        return;
    }
    if (json['return_code'] != 'SUCCESS') {
        cb("<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_mg></xml>");
        return;
    }

    var allmap = ksort(json);
    var signPars = '';
    for (var key in allmap) {
        if (allmap[key] != "" && key != "sign")
            signPars += key + '=' + allmap[key] + "&"; 
    }
    signPars += "key=" + "fewafu23uNUInw1891nuiNu23895Amie";
    var md5sign = md5(signPars);

    if (md5sign.toUpperCase() == allmap['sign'].toUpperCase()) {
        cb("<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[OK]]></return_mg></xml>");
        return;
    }

    var fee = parseInt(json['cash_fee'])/100;
    var attach = json['attach'];

    pomelo.app.rpc.business.gameRemote.fkbill(null, attach, fee, function(err, res){
        cb("<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_mg></xml>");
        return;
    });
}

var crypto = require("crypto");
var Buffer = require("buffer").Buffer;


function md5(data){
    var buf = new Buffer(data);
    var str = buf.toString("binary");
    return crypto.createHash("md5").update(str).digest("hex");
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