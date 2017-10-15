var express = require('express');
var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require("pomelo");

var app = express();

var hallAddr = "";

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

var config = null;

exports.start = function(cfg){
    config = cfg;
    hallAddr = config.SERVER_IP  + ":" + config.CLIENT_PORT;
    app.listen(config.CLIENT_PORT);
    logger.log("gate server is listening on " + config.CLIENT_PORT);
}

//ÉèÖÃ¿çÓò·ÃÎÊ
app.all('*', function(req, res, next) {
    req.ip = getClientIp(req);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get("/sync", function(req, res){
    var t = req.query.t;

    
});