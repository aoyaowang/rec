/**
 * Created by hasee on 2017-10-12.
 */
var Player = cc.Class.extend({
    nickname: "",
    sex: 1, //1ÄÐ  2Å®
    head: "",
    userid: "",
});

var __selfinfo = Player.extend({
    fangka: 0,
    money: 0,

    token: "",
    roomlist: null,
    ctor:function(){
        this.roomlist = [];
    }
});

var RoleInfo = new __selfinfo();