/**
 * Created by A on 2017/10/13.
 */
var crypto = require('crypto');

module.exports.create = function(uid, timestamp, ip, pwd) {
    var msg = uid + '|' + timestamp + '|' + ip;
    var cipher = crypto.createCipher('aes256', pwd);
    var enc = cipher.update(msg, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
};

module.exports.parse = function(token, pwd) {
    if(token == "undefined") return null;

    var decipher = crypto.createDecipher('aes256', pwd);
    var dec;
    try {
        dec = decipher.update(token, 'hex', 'utf8');
        dec += decipher.final('utf8');
    } catch(err) {
        console.error('[token] fail to decrypt token. %j', token);
        return null;
    }
    var ts = dec.split('|');
    if(ts.length !== 3) {
        // illegal token
        return null;
    }
    return {uid: ts[0], timestamp: Number(ts[1]), ip: ts[2]};
};
