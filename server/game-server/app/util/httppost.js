/**
 * Created by root on 11/25/15.
 */
var httppos = module.exports;
var enums = require('../consts/enums');
var http = require('https');
var qs = require('querystring');

var fs = require('fs');


httppos.httpPost = function(host,port,path,obj,cb) {
    var post_data = qs.stringify(obj);

    //var options = {
    //    host: host,
    //    port: port,
    //    path: path + "?" + post_data,
    //    method: 'GET',
    //};
    var options = {
        host: host,
        port: port,
        path: path + "?" + post_data,
        method: 'GET'
    };
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {
            data = JSON.parse(data);
            //判断是否为json对象
            var b = typeof(data) == 'object' && Object.prototype.toString.call(data).toLowerCase() == '[object object]' && !data.length;
            if (b) {
                //logger.warn('777777777777777:' + JSON.stringify(data));
                cb(null, data);
            } else {
                //非json对象返回-400错误
                cb(true, null);
            }
        });
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        cb(true, null);
    });

    req.end();
};

var httpNormal = require("http");
httppos.payPost = function(host,port,path,obj,cb) {
    //var post_data = qs.stringify(obj);
    var b1 = new Buffer(obj);
    var options = {
        host: host,
        port: port,
        path: path + "?" + obj,
        method: 'POST',
        headers: {
            'Content-Length': b1.length,
        }
    };
    var req = httpNormal.request(options, function (res) {
        var body = "";
        res.setEncoding('utf8');

        res.on('data', function (tdata) {
            body += tdata;
        });
        res.on('end', function() {
            var data = body;
            cb(null, data);
        })
    });
    req.on('error', function (e) {
        logger.warn('problem with request: ' + e.message + ' ' + path);
        cb(true, null);
    });

    req.write(obj);
    req.end();
};

httppos.Post4 = function(host,port,path,obj,cb) {
    //var post_data = qs.stringify(obj);
    var b1 = new Buffer(obj);
    var options = {
        host: host,
        port: port,
        path: path,
        method: 'POST',
        headers: {
            'Content-Length': b1.length,
        }
    };
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    var req = http.request(options, function (res) {
        var body = "";
        res.setEncoding('utf8');

        res.on('data', function (tdata) {
            body += tdata;
        });
        res.on('end', function() {
            var data = body;
            //判断是否为json对象
            var b = typeof(data) == 'object' && Object.prototype.toString.call(data).toLowerCase() == '[object object]' && !data.length;
            if (b) {
                //logger.warn('777777777777777:' + JSON.stringify(data));
                cb(null, data);
            } else {
                //非json对象返回-400错误
                cb(true, body);
            }
        })
    });
    req.on('error', function (e) {
        logger.warn('problem with request: ' + e.message + ' ' + path);
        cb(true, null);
    });

    req.write(obj);
    req.end();
};

httppos.turnto = function(data, cb) {
    httppos.Post4("api.mch.weixin.qq.com",443,'/mmpaymkttransfers/promotion/transfers',data, cb);
};

httppos.turn = function(openid, money, cb) {
    var trade_no = (new Date()).getTime() + randomWord(true, 4, 4);

    var map = {};
    map['mch_appid'] = enums.APPID;
    map['mchid'] = enums.MCHID;
    map['nonce_str'] = randomWord(true, 20, 20);
    map["partner_trade_no"] = trade_no;
    map["openid"] = openid;
    map["check_name"] = "NO_CHECK";
    map["amount"] = money*100;
    map['spbill_create_ip'] = '127.0.0.1';
    map['desc'] = "活动奖励";
    map = ksort(map);

    var signPars = '';
    for (var key in map) {
        if (map[key] != "" && key != "sign")
            signPars += key + '=' + map[key] + "&"; 
    }
    signPars += "key=" + "fewafu23uNUInw1891nuiNu23895Amie";
    var md5sign = md5(signPars);
    map['sign'] = md5sign.toUpperCase();

    var j = '<xml>' + json2xml(map, '') + '</xml>';

    httppos.turnto(j, cb);
}

var crypto = require("crypto");
var Buffer = require("buffer").Buffer;

function md5(data){
    var buf = new Buffer(data);
    var str = buf.toString("binary");
    return crypto.createHash("md5").update(str).digest("hex");
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