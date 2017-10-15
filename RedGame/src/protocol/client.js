/**
 * Created by hasee on 2017-10-12.
 */
var Client = {
    name: "Client",
    _list: {},
    addMap:function(name, target) {
        if (!this._list[name]) this._list[name] = [];
        this._list[name].push(target);
    },
    removeMap:function(name, target) {
        if (!this._list[name]) return;
        for (var i in this._list[name]) {
            if (this._list[i] == target) {
                this._list.splice(i, 1);
                break;
            }
        }
    },
    onMsg:function(id, msg, req) {
        Nlog("Msg:" + id + JSON.stringify(msg));
        if (msg.code == -99 || msg.code == 500) {
            this.onError(msg.code);
        }
        if (msg.errormsg) {
            this.ShowMessage(msg.errormsg || "");
        }
        if (!!this._list[id]) {
            for (var i in this._list[id]) {
                this._list[id][i][id](msg, req);
            }
        }
    },
    onError:function(code){
        var msg = ERRORID[code] || "";
        var scene = cc.director.getRunningScene();
        if (!!scene) {
            var mess = new messageUI(msg);
            scene.addChild(mess, 9999);
        }
    },
    ShowMessage:function(msg) {
        var scene = cc.director.getRunningScene();
        if (!!scene) {
            var mess = new messageUI(msg);
            scene.addChild(mess, 9999);
        }
    }
};