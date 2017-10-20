/**
 * Created by hasee on 2017-10-17.
 */
var saoleiUI = ccui.Widget.extend({
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
        this.m_ft_money = ccui.helper.seekWidgetByName(this.Widget, "ft_money");
        this.m_ft_money.setString(RoleInfo.money);
        this.m_title = ccui.helper.seekWidgetByName(this.Widget, "ft_title");
        this.m_title.setString(title);
        var btnred = ccui.helper.seekWidgetByName(this.Widget, "btn_red");
        btnred.addClickEventListener(this.redClick.bind(this));
        var btnlog = ccui.helper.seekWidgetByName(this.Widget, "btn_log");
        btnlog.addClickEventListener(this.logClick.bind(this));

        this.m_redlist = {};
        return true;
    },
    onEnter:function() {
        this._super();
        RoleInfo.addOb(this.infoChange, this);
        Client.addMap("shaoleicreate", this);
        Client.addMap("playerenter", this);
        Client.addMap("playerleave", this);

        Client.addMap("saoleiQiangrq", this);
        Client.addMap("shaoleiqiang", this);
        Client.addMap("shaoleiover", this);
        Client.addMap("getdetail", this);
        var msg = new chatsysUI(RoleInfo.username() + " 进入房间");
        this.m_list.pushBackCustomItem(msg);
    },
    onExit:function() {
        this._super();
        RoleInfo.removeOb(this.infoChange, this);
        Client.removeMap("shaoleicreate", this);
        Client.removeMap("playerenter", this);
        Client.removeMap("playerleave", this);

        Client.removeMap("saoleiQiangrq", this);
        Client.removeMap("shaoleiqiang", this);
        Client.removeMap("shaoleiover", this);
        Client.removeMap("getdetail", this);
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
    shaoleicreate:function(msg){
        if (!msg || !msg.data) return;
        msg = msg.data;
        var coin = msg.coin;
        var num = msg.num;
        var bomb = msg.bomb;
        var owner = msg.owner;
        var red = coin + "金额/雷" + bomb + "/" + (num == 7 ? "1.5" : "1.0") +"倍";

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
            var c = new chatredUI(data, owner.gamename == "" ? owner.nickname : owner.gamename, red, this.packetClick.bind(this));
            c.setUserData({halltype: msg.HallType, roomid: msg.RoomID});
            this.m_redlist[msg.RoomID].target = c;
            this.m_list.pushBackCustomItem(c);
        }.bind(this));
    },
    redClick:function() {
        var ui = new saoleired(this.m_type);
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
            var ui = new reddetailUI(r.detail);
            this.Widget.addChild(ui, 99);
        }
    },
    saoleiQiangrq:function(msg) {
        //NOTUSED
    },
    shaoleiqiang:function(msg) {
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
    shaoleiover:function(msg) {
        var id = msg.roomid;
        if (!this.m_redlist[id]) return;
        this.m_redlist[id].state = this.m_redlist[id].state == 0 ? 1 : this.m_redlist[id].state;
        var text = msg.owner.gamename == "" ? msg.owner.nickname : msg.owner.gamename;
        var ui = new chatsysUI(text + msg.over ? "红包已经被抢完" : "红包已经结束");
        this.m_list.pushBackCustomItem(ui);
        for (var key in msg.data) {
            var p = msg.data[key];
            var n = p.gamename == "" ? p.nickname : p.gamename;
            var m = p.qiang;
            var l = p.last;
            if (p.uid == this.m_redlist[id].owner.uid) {
                var ui2 = new chatnormalUI("【发】 " + n + "免死", cc.Color(0,0,200));
                this.m_list.pushBackCustomItem(ui2);
            }
            else if (msg.bomb == l)                {
                var ui2 = new chatnormalUI("【抢】 " + n + "中雷", cc.Color(255,0,0));
                this.m_list.pushBackCustomItem(ui2);
            } else {
                var ui2 = new chatnormalUI("【抢】 " + n + "无雷", cc.Color(255,255,255));
                this.m_list.pushBackCustomItem(ui2);
            }
        }
    },
    getdetail:function(msg) {
        var id = msg.roomid;
        if (!this.m_redlist[id]) return;
        if (msg.over) {
            this.m_redlist[id].state = 3;
            this.m_redlist[id].detail = msg;
        }
        var ui = new reddetailUI(msg);
        this.Widget.addChild(ui, 99);
    }
});