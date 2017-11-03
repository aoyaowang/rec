var pomelo = require('pomelo');
var fs = require('fs');

var routeUtil = require('./app/util/routeUtil');
//var tickManager = require('./app/util/tickManager')
var mysqlMgr = require('./app/dao/mysql/mysqlMgr');
var enums = require('./app/consts/enums');
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'Server');

//var tickmanager = tickManager.init();
app.set('tickManager',require('./app/util/tickManager')());

app.configure('production|development', function() {
  app.loadConfig('sql_game_zone', app.getBase() + '/config/mysql.json');
});

// Configure database
app.configure('production|development', 'business', function() {
  var mysql_game = 'sql_game_zone';
  for(var i=1;i<enums.SQLNUM+1;i++)
  {
    var dbclient_game = mysqlMgr.init(app,mysql_game,i);
    app.set('db' + i, dbclient_game);
  }
});

app.configure('production|development', 'http', function() {
  var gate = require("./app/gate/gate");
  gate.start();

  var gm = require("./app/gate/gm");
  gm.start(9800);
});

app.start();

app.event.on('start_all',function()
{

  if(app.serverType == "master")
  {


    //var json = require("./config/barserversinfo.json");
    //require("./app/util/serverMgrUtil").addServers(json,function(msg)
    //{
    //  console.log(JSON.stringify(msg));
    //})
  }
});

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});

process.on('SIGUSR1', function() {

});