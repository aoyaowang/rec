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
             else if ("/getdetail" === urlInfo.pathname)
             {
                 var t = reqInfo.t;
                 var h = reqInfo.h;
                 var r = reqInfo.r;
                 getDetail(t, h, r, resback);
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

function getDetail(t, h, r, cb) {
    pomelo.app.rpc.business.gameRemote.getDetail(null, t, h, r, function(err, res){
        cb(res || {code: consts.NOR_CODE.FAILED});
    });
}