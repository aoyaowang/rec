/**
 * Created by root on 11/25/15.
 */
var httppos = module.exports;
var enums = require('../consts/enums');
var http = (enums.CONNECT_TYPE == 1 ? require('https') : require('http'));
var qs = require('querystring');

var fs = require('fs');
var _key = fs.readFileSync("../../crt/hiba_nopass.key");
var _cert = fs.readFileSync("../../crt/hiba.crt");


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
        method: 'GET',
        key: _key,
        cert:_cert
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
