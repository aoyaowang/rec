/**
 * Created by A on 2017/10/13.
 */
var SERVER_IP = "127.0.0.1";

var TOKEN_SECRET = "IQW*(!!ji!";

exports.mysql = function(){
    return {
        HOST:'localhost',
        USER:'root',
        PSWD:'rootroot',
        DB:'red',
        PORT:3306,
    }
};

//’À∫≈∑˛≈‰÷√
exports.login_server = function(){
    return {
        CLIENT_PORT:5000,
        SERVER_IP:SERVER_IP,
        TOKEN_SECRET:TOKEN_SECRET,

        VERSION:'20171013',
    };
};