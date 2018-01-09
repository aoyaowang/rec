/**
 * Created by hasee on 2017-10-12.
 */
var Player = cc.Class.extend({
    nickname: "",
    gamename: "",
    sex: 1, //1��  2Ů
    head: "",
    uid: "",
    img:null,
    referee: "",
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
    sync:0,

    beginSync:function() {
        Client.addMap("sync", this);
        Server.gate("sync", {t: this.token});

        Client.addMap("moneysync", this);
    },
    endSync:function() {
        this.logined = false;
        Client.removeMap("sync", this);

        Client.removeMap("moneysync", this);
    },
    sync:function() {
        if (!this.logined) return;
        setTimeout(function(){
            Server.gate("sync", {t: this.token});
        }.bind(this), 1000);
    },
    moneysync:function(msg) {
        this.money = msg.money;
        this.fangka = msg.fangka;
        this.notify();
    }
});

var RoleInfo = new __selfinfo();