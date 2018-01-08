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
                setRvalue(uids, r, resback);
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