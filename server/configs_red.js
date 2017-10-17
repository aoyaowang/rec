/**
 * Created by A on 2017/10/13.
 */
var SERVER_IP = "landking.tech";

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

//�˺ŷ�����
exports.login_server = function(){
    return {
        CLIENT_PORT:5000,
        SERVER_IP:SERVER_IP,
        TOKEN_SECRET:TOKEN_SECRET,

        VERSION:'20171013',
        APP_WEB:'http://fir.im/2f17',
        SERVERS: [
            {IP:SERVER_IP,port: 20000},
            {IP:SERVER_IP,port: 20001},
            {IP:SERVER_IP,port: 20002}
        ]
    };
};

exports.game_server = function(){
    return{

    };
};