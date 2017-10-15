/**
 * Created by root on 12/24/15.
 */


var jsPath =  "/../recheck/js/";
var logPath = "/../recheck/log/";

var fs=require("fs");
var baseRemote = function()
{

}
baseRemote.prototype.log = function(file,str)
{
    var mFile = process.cwd()+logPath+file+".txt";

    fs.appendFileSync(mFile,str,'utf8');
}
baseRemote.prototype.checkByFile = function(file,next)
{
    //file = "test";
    var nfile = process.cwd()+jsPath+file+".js";
    var data=fs.readFileSync(nfile,"utf-8");
    eval(data);
    if(next)
    {
        next();
    }
}


module.exports = baseRemote;