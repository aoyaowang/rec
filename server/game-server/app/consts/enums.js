/**
 * Created by root on 10/30/15.
 */
module.exports = {
    PROTOCOL:{
        PLAYER_ENTER: "playerenterroom",
        PLAYER_LEAVE: "playerleaveroom",
        
        MONEY_SYNC: "moneysync",
        RELOGIN:"relogin",

        GAME_SHAOLEI_CREATE: "shaoleicreate",
        GAME_SHAOLEI_QIANG: "shaoleiqiang",
        GAME_SHAOLEI_OVER: "shaoleiover",

        GAME_JIELONG_CREATE: "jielongcreate",
        GAME_JIELONG_QIANG: "jielongqiang",
        GAME_JIELONG_OTHERQIANG: "jielongotherqiang",
        GAME_JIELONG_OVER: "jielongover",

        GAME_NIUNIU_CREATE: "niuniucreate",
        GAME_NIUNIU_QIANG: "niuniuqiang",
        GAME_NIUNIU_OTHERQIANG: "niuniuotherqiang",
        GAME_NIUNIU_OVER: "niuniuover",

        GAME_28_CREATE: "28create",
        GAME_28_QIANG: "28qiang",
        GAME_28_OTHERQIANG: "28otherqiang",
        GAME_28_OVER: "28over",

        GET_DETAIL:"getdetail"
    },
    CHANGETYPE: {
        ADD: 0,
        DEL: 1
    },
    R_INFO: {
        1:{//王者代理

        },
        3:{//钻石代理
            1:[0.8, 0.4],
            2:[0.4, 0.2],
            3:[0.2, 0.1]
        },
        4:{//黄金代理
            1:[0.6, 0.3],
            2:[0.3, 0.15]
        },
        5:{//白银代理
            1:[0.5, 0.25],
            2:[0.25,0.125]
        }
    },
    HALL_TPYE_NUM: 4,
    SQLNUM: 1,

    DEBUG_IP: '127.0.0.1',

    OUTTIME: 30,

    APPID: "wx1002e4f4a3b4b0bd",
    APPSERCET: "",
    MCHID: "1484859142",
    MCHKEY: "fewafu23uNUInw1891nuiNu23895Amie"
}