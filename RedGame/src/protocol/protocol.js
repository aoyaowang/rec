var g_server = "http://landking.tech:5000/";
var g_gate = "";

var g_protocol = {
    "login": "login",
    "wxlogin": "wechat_auth",
    "tokenlogin":"tokenlogin",
    "bill":"bill",

    ///////////SEND_GATE/////////////
    "entergame": "enter",
    "turnto": "turnto",
    "sync":"sync",
    "gethallinfo":"gethallinfo",
    "joinroom":"joinroom",
    "leaveroom":"leaveroom",
    "createsaolei":"createsaolei",
    "createjielong":"createjielong",
    "createniuniu":"createniuniu",
    "create28":"create28",
    "saoleiQiangrq":"saoleiQiang",
    "jielongQiangrq":"saoleiQiang",
    "saoleiQiangrq":"saoleiQiang",
    "getdetail":"getdetail",

    ///////////SERVER_PUSH/////////////////////
    "moneysync": "moneysync",
    "relogin": "relogin",

    "shaoleicreate": "shaoleicreate",
    "shaoleiqiang": "shaoleiqiang",
    "shaoleiover": "shaoleiover",
    "playerenterroom": "playerenterroom",
    "playerleaveroom": "playerleaveroom",

    "jielongcreate": "jielongcreate",
    "jielongqiang": "jielongqiang",
    "jielongotherqiang": "jielongotherqiang",
    "jielongover": "jielongover",

    "niuniucreate": "niuniucreate",
    "niuniuotherqiang": "niuniuotherqiang",
    "niuniuqiang": "niuniuqiang",
    "niuniuover": "niuniuover",

    "28create": "28create",
    "28otherqiang": "28otherqiang",
    "28qiang": "28qiang",
    "28over": "28over"
};