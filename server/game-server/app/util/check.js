/**
 * Created by root on 11/10/15.
 */
var check = module.exports;
var enums = require("../consts/enums");
check.checkInTime = function(b,d,c)
{
    //(timer.task_refresh_timer + enums.TASK.REFRESH_DELAY) - currentTime)
    return Math.abs(b+d-c)<enums.TIME_OFFSET;
}