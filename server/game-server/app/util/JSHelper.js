/**
 * Created by root on 11/30/15.
 */
var JSHelper = module.exports;

JSHelper.Type ={
    BEFOR:1,
    AFTER:2
}
JSHelper.reDefineFun = function(target,funName,fun,type)
{
    var oldfun = target[funName];
    var newfun = null;
    if(oldfun)
    {

        if(type == JSHelper.Type.BEFOR )
        {
            newfun= function()
            {
                oldfun.apply(target,arguments);
                fun.apply(target,arguments);
            }
        }
        else if(type == JSHelper.Type.AFTER )
        {

            newfun=function()
            {
                fun.apply(target,arguments);
                oldfun.apply(target,arguments);
            }
        }

    }
    else
    {
        newfun = fun;
    }

    target[funName] = newfun;
}

JSHelper.getTimestampoffsetByHour = function(h)
{
    var now = new Date();
    var timestamp = Date.parse(now);
    var hour = now.getHours();

    if(h>hour)
    {

        now.setHours(h);
        now.setMinutes(0);
        now.setSeconds(0);
        var timestamp2 = Date.parse(now);
        return timestamp2-timestamp;
    }
    else
    {
        timestamp2 = timestamp + 60*60*24*1000;

        var next = new Date(timestamp2);

        next.setHours(h);
        next.setMinutes(0);
        next.setSeconds(0);

        var timestamp2 = Date.parse(next);
        return timestamp2-timestamp;
    }
}

JSHelper.getTimestampoffsetByMonth = function(d,h)
{
    var now = new Date();
    var timestamp = Date.parse(now);
    var hour = now.getHours();
    var month = now.getMonth();
    var day = now.getDate();

    if(d>day || (d==day && h>hour))
    {
        now.setDate(d);
        now.setHours(h);
        now.setMinutes(0);
        now.setSeconds(0);

    }
    else
    {
        now.setMonth(month+1);
        now.setDate(d);
        now.setHours(h);
        now.setMinutes(0);
        now.setSeconds(0);

    }

    var timestamp2 = Date.parse(now);
    return timestamp2-timestamp;

}
