/**
 * Created by root on 11/12/15.
 */


var process = require('child_process');

var util = require('util');
var async = require('async');

var serverMgrUtil = module.exports;

serverMgrUtil.addServers = function(servers,cb)
{

    function resBack(info) {

        return function(callback){
            var execStr = util.format(" pomelo add host=%s port=%s serverType=%s id=%s",info.host,info.port,info.serverType,info.id);


            if(info.hasOwnProperty('clientPort'))
            {
                execStr += "clientPort="+info.clientPort +" frontend=true"
            }
            process.exec(execStr,function(error,stdout,stderr)
            {
                callback(null,error,stdout,stderr);
            });
        }
    }


    var ay = [];
    for(var i=0;i<servers.length;i++)
    {
        ay.push(resBack(servers[i]))
    }
    async.parallel(ay,function(msg)
    {
        var error = [];
        var stdout = [];
        var stderr = [];
        cb(msg);
    })


    //for(var i=0;i<servers.length;i++)
    //{
    //    //pomelo add host=127.0.0.1 port=8000 clientPort=9000 frontend=true serverType=connector id=added-connector-server
    //    var info = servers[i];
    //    var execStr = util.format(" pomelo add host=%s port=%s serverType=%s id=%s",info.host,info.port,info.serverType,info.id);
    //
    //
    //    if(info.hasOwnProperty('clientPort'))
    //    {
    //        execStr += "clientPort="+info.clientPort +" frontend=true"
    //    }
    //    process.exec(execStr,function(error,stdout,stderr)
    //    {
    //        cb(error,stdout,stderr);
    //    });
    //}

}