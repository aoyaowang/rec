/**
 * Created by hasee on 2017-10-29.
 */
var niuniuUI = ccui.Widget.extend({
    m_title:null,
    m_list:null,
    m_ft_money:null,

    m_type:null,
    m_subtype:null,

    m_redlist:null,
    ctor:function(type, subtype, title) {
        this._super();

        this.m_type = type;
        this.m_subtype = subtype;

        var l = ccs.load("res/chat.json");
        this.Widget = l.node;
        this.addChild(this.Widget);


        this.setContentSize(this.Widget.getContentSize());
        this.setAnchorPoint(0, 0);

        this.m_list = ccui.helper.seekWidgetByName(this.Widget, "chatview");
        this.m_list.setBackGroundImage("res/backGround/niuniu.jpg");
        this.m_ft_money = ccui.helper.seekWidgetByName(this.Widget, "ft_money");
        this.m_ft_money.setString(RoleInfo.money);
        this.m_title = ccui.helper.seekWidgetByName(this.Widget, "ft_title");
        this.m_title.setString(title);
        var btnred = ccui.helper.seekWidgetByName(this.Widget, "btn_red");
        btnred.addClickEventListener(this.redClick.bind(this));
        var btnlog = ccui.helper.seekWidgetByName(this.Widget, "btn_log");
        btnlog.addClickEventListener(this.logClick.bind(this));

        var btn = ccui.helper.seekWidgetByName(this.Widget, "btn_back");
        btn.addClickEventListener(this.backClick.bind(this));

        this.m_redlist = {};
        return true;
    },
    onEnter:function() {
        this._super();
        RoleInfo.addOb(this.infoChange, this);
        Client.addMap("niuniucreate", this);
        Client.addMap("playerenter", this);
        Client.addMap("playerleave", this);

        Client.addMap("niuniuQiangrq", this);
        Client.addMap("niuniuqiang", this);
        Client.addMap("niuniuover", this);
        Client.addMap("getdetail", this);
        Client.addMap("niuniuotherqiang", this);
        var msg = new chatsysUI(RoleInfo.username() + " 进入房间");
        this.m_list.pushBackCustomItem(msg);
    },
    onExit:function() {
        this._super();
        RoleInfo.removeOb(this.infoChange, this);
        Client.removeMap("niuniucreate", this);
        Client.removeMap("playerenter", this);
        Client.removeMap("playerleave", this);

        Client.removeMap("niuniuQiangrq", this);
        Client.removeMap("niuniuqiang", this);
        Client.removeMap("niuniuover", this);
        Client.removeMap("getdetail", this);
        Client.removeMap("niuniuotherqiang", this);
    },
    backClick:function(){
        this.removeFromParent();
    },
    infoChange:function() {
        this.m_ft_money.setString(RoleInfo.money);
    },
    playerenter:function(msg) {
        if (!msg || !msg.data) return;
        msg = msg.data;
        var msg = new chatsysUI((msg.gamename == "" ? msg.nickname : msg.gamename) + " 进入房间");
        this.m_list.pushBackCustomItem(msg);
    },
    playerleave:function(msg) {
        if (!msg || !msg.data) return;
        msg = msg.data;
        var c = new chatsysUI((msg.gamename == "" ? msg.nickname : msg.gamename) + " 离开房间");
        this.m_list.pushBackCustomItem(c);
    },
    niuniucreate:function(msg){
        if (!msg || !msg.data) return;
        msg = msg.data;
        var coin = msg.coin;
        var num = msg.num;
        var bomb = msg.bomb;
        var owner = msg.owner;
        var red = "恭喜发财，大吉大利";

        this.m_redlist[msg.RoomID] = {
            coin: coin,
            num: num,
            bomb: bomb,
            owner: owner,
            msg: msg,
            roomid: msg.RoomID,
            halltype: msg.HallType,
            state: 0
        };
        headMgr.loadHead(owner.uid, owner.headimg, function(data){
            var c = new chatredUI(data, owner.gamename == "" ? owner.nickname : owner.gamename, red, "王者牛牛", this.packetClick.bind(this));
            c.setUserData({halltype: msg.HallType, roomid: msg.RoomID});
            this.m_redlist[msg.RoomID].target = c;
            this.m_list.pushBackCustomItem(c);
        }.bind(this));
    },
    redClick:function() {
        var ui = new niuniured(this.m_type, this.m_subtype);
        this.Widget.addChild(ui);
    },
    logClick:function() {
        this.removeFromParent();
        uiMgr.mainUI.changeUI(1);
    },
    packetClick:function(sender) {
        var data = sender.getUserData();
        var r = this.m_redlist[data.roomid];
        if (r.state == 0) {
            var ui = new redqiangUI(this.m_type,r);
            this.Widget.addChild(ui, 99);
            //Server.gate("saoleiQiangrq", {t: RoleInfo.token, h: data.halltype, r: data.roomid});
        }
        else if (r.state == 1) { //没有抢到，已经没了
            var ui = new redoverUI(this.m_type,r);
            this.Widget.addChild(ui, 99);
        }
        else if (r.state == 2) { //抢到了
            Server.gate("getdetail", {t: RoleInfo.token, h: data.halltype, r: data.roomid});
        }
        else if (r.state == 3 && r.detail) {
            var ui = new reddetailUI(r.detail, r);
            this.Widget.addChild(ui, 99);
        }
    },
    niuniuQiangrq:function(msg) {
        //NOTUSED
    },
    niuniuotherqiang:function(msg){
        var id = msg.RoomID;
        if (!this.m_redlist[id]) return;
        var onick = this.m_redlist[id].owner.gamename == "" ? this.m_redlist[id].owner.nickname : this.m_redlist[id].owner.gamename;
        var text = (msg.user.gamename == "" ? msg.user.nickname : msg.user.gamename) + " 抢走红包，与庄家兵戎相见！";
        var ui = new chatsysUI(text);
        this.m_list.pushBackCustomItem(ui);
    },
    niuniuqiang:function(msg) {
        var id = msg.RoomID;
        if (!this.m_redlist[id]) return;
        var money = msg.data.qiang;
        var data = msg.other;
        var coin = msg.coin;
        var num = msg.num;

        this.m_redlist[id].state = 2;

        var ui = new redopenUI(this.m_type,id, money, coin, num, data, this.m_redlist[id]);
        this.Widget.addChild(ui, 99);
    },
    niuniuover:function(msg) {
        var id = msg.roomid;
        if (!this.m_redlist[id]) return;
        this.m_redlist[id].state = this.m_redlist[id].state == 0 ? 1 : this.m_redlist[id].state;
        var text = msg.owner.gamename == "" ? msg.owner.nickname : msg.owner.gamename;
        var ui = new chatsysUI(text + msg.over ? "红包已经被抢完" : "红包已经结束");
        this.m_list.pushBackCustomItem(ui);

        var numstr = {1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六", 7: "七", 8: "八", 9: "九", 0: "牛"}
        for (var key in msg.data) {
            var p = msg.data[key];
            var n = p.gamename == "" ? p.nickname : p.gamename;
            var m = p.qiang;
            var l = p.last;
            var l2 = p.last2;
            var nx = numstr[( l + l2 ) % 10];
            if (p.uid == this.m_redlist[id].owner.uid) {
                var ui2 = new chatnormalUI("【庄】 " + n + "(" + (parseInt(m) / 100) + ") 牛" + nx, p.result > 0 ? cc.color(255,255,255) : nx, cc.color(255,0,0));
                this.m_list.pushBackCustomItem(ui2);
            } else {
                var ui2 = new chatnormalUI("【抢】 " + n + "(" + (parseInt(m) / 100) + ") 牛" + nx, p.result > 0 ? cc.color(255,255,255) : nx, cc.color(255,0,0));
                this.m_list.pushBackCustomItem(ui2);
            }
        }
    },
    getdetail:function(msg) {
        if (msg.code !=0 ) return;
        msg = msg.data;
        var id = msg.roomid;
        if (!this.m_redlist[id]) return;
        if (msg.over) {
            this.m_redlist[id].state = 3;
            this.m_redlist[id].detail = msg;
        }
        var ui = new reddetailUI(msg, this.m_redlist[id]);
        this.Widget.addChild(ui, 99);
    }
});