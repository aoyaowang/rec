/**
 * Created by jianhua on 15-8-29.
 */
var SendMsgpProtocol = module.exports;
var consts = require('../consts/consts');
var logger = require('pomelo-logger').getLogger(__filename);
SendMsgpProtocol.pro = function(data)
{
    data.timestamp =  Date.parse(new Date()) / 1000;
    if(data.code == undefined)
    {
        logger.warn("code not exsit");
        data.code = consts.NOR_CODE.ERR_BACK_CODE;
    }
    return data;
}