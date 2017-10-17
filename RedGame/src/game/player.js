/**
 * Created by hasee on 2017-10-12.
 */
var Player = cc.Class.extend({
    nickname: "",
    gamename: "",
    sex: 1, //1ÄÐ  2Å®
    head: "",
    uid: "",
    img:null,
    username:function() {
        return this.gamename == "" ? this.nickname : this.gamename;
    },

    _list:null,
    addOb:function(cb, target) {
        if (!this._list) this._list = [];
        this._list.push({cb: cb, target: target});
        var func = cb.bind(target);
        func(this);
    },
    removeOb:function(cb, target) {
        if (!this._list) return;
        for (var key in this._list) {
            if (this._list[key].cb == cb && this._list[key].target == target) {
                this._list.splice(key, 1);
                break;
            }
        }
    },
    notify:function() {
        for (var key in this._list) {
            var cb = this._list[key].cb;
            var target = this._list[key].target;

            cb = cb.bind(target);
            cb(this);
        }
    }
});

var __selfinfo = Player.extend({
    fangka: 0,
    money: 0,

    token: "",
    logined: false,
    sync:0
});

var RoleInfo = new __selfinfo();