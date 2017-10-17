/**
 * Created by hasee on 2017-10-17.
 */
var saoleiUI = cc.Layer.extend({
    m_title:null,
    m_list:null,
    m_ft_money:null,

    m_type:null,
    m_subtype:null,

    m_redlist:null,
    ctor:function(type, subtype, title) {
        this._super();

        this.m_type = type;
        this.m_subtype = subsype;

        var l = ccs.load("res/chat.json");
        this.Widget = l.node;
        this.addChild(this.Widget);

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
        Client.addMap("saoleiqiang", this);
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
        Client.removeMap("saoleiqiang", this);
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
        var red = coin + "金/雷" + bomb + "/" + (num == 7 ? "1.5" : "1.0") +"倍";

        this.m_redlist[msg.RoomID] = {
            coin: coin,
            num: num,
            bomb: bomb,
            owner: owner,
            msg: msg,
            state: 0
        };
        headMgr.loadHead(owner.uid, owner.headimg, function(data){
            var c = new chatredUI(data, owner.gamename == "" ? owner.nickname : owner.gamename, red, this.packetClick.bind(this));
            c.setUserData({halltype: msg.HallType, roomid: msg.RoomID});
            this.m_redlist[msg.RoomID].target = c;
            this.m_list.pushBackCustomItem(c);
        });
    },
    redClick:function() {
        var ui = new saoleired(this.m_subtype);
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
        else if (r.state == 1) { //自己没抢到，抢完了
            var ui = new redoverUI(this.m_type,r);
            this.Widget.addChild(ui, 99);
        }
        else if (r.state == 2) { //自己抢到了，直接看详情
            Server.gate("getdetail", {t: RoleInfo.token, h: data.halltype, r: data.roomid});
        }
    },
    saoleiQiangrq:function(msg) {

    },
    saoleiqiang:function(msg) {

    },
    shaoleiover:function(msg) {

    },
    getdetail:function(msg) {

    }
});