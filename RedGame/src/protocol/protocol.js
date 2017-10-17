var g_server = "http://landking.tech:5000/";
var g_gate = "";

var g_protocol = {
    "login": "login",
    "wxlogin": "wechat_auth",
    "tokenlogin":"tokenlogin",

    ///////////SEND_GATE/////////////
    "entergame": "enter",
    "sync":"sync",
    "gethallinfo":"gethallinfo",
    "joinroom":"joinroom",
    "leaveroom":"leaveroom",
    "createsaolei":"createsaolei",
    "saoleiQiangrq":"saoleiQiang",
    "getdetail":"getdetail",

    ///////////SERVER_PUSH/////////////////////
    "moneysync": "moneysync",
    "relogin": "relogin",

    "shaoleicreate": "shaoleicreate",
    "shaoleiqiang": "shaoleiqiang",
    "shaoleiover": "shaoleiover",
    "playerenter": "playerenterroom",
    "playerleave": "playerleaveroom"
};