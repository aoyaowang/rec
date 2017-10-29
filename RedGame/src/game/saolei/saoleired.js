/**
 * Created by hasee on 2017-10-17.
 */
var saoleired = ccui.Widget.extend({
    m_l1: null,
    m_l2: null,
    m_l3: null,

    m_list: null,

    m_ft_money: null,
    m_ft_num: null,
    m_ft_bomb: null,

    m_subtype: null,
    m_roomtype: null,

    m_s1: null,
    m_s2: null,
    m_s3: null,

    m_sendbtn:null,
    ctor:function(subtype, roomtype) {
        this._super();

        this.m_subtype = subtype;
        this.m_roomtype = roomtype;

        this.m_l1 = [];
        this.m_l2 = [];
        this.m_l3 = [];

        var l = ccs.load("res/saolei.json");
        this.Widget = l.node;
        this.addChild(this.Widget);


        this.setContentSize(this.Widget.getContentSize());
        this.setAnchorPoint(0, 0);

        this.m_list = ccui.helper.seekWidgetByName(this.Widget, "ListView_1");
        var p = ccui.helper.seekWidgetByName(this.Widget, "btn_1");
        p.addClickEventListener(this.btn1Click.bind(this));
        p = ccui.helper.seekWidgetByName(this.Widget, "btn_2");
        p.addClickEventListener(this.btn2Click.bind(this));
        p = ccui.helper.seekWidgetByName(this.Widget, "btn_3");
        p.addClickEventListener(this.btn3Click.bind(this));

        this.m_ft_money = ccui.helper.seekWidgetByName(this.Widget, "ft_money");
        this.m_ft_bomb = ccui.helper.seekWidgetByName(this.Widget, "ft_bomb");
        this.m_ft_num = ccui.helper.seekWidgetByName(this.Widget, "ft_num");

        this.m_s1 = ccui.helper.seekWidgetByName(this.Widget, "s1");
        this.m_s2 = ccui.helper.seekWidgetByName(this.Widget, "s2");
        this.m_s3 = ccui.helper.seekWidgetByName(this.Widget, "s3");

        this.m_sendbtn = ccui.helper.seekWidgetByName(this.Widget, "btn_send");
        this.m_sendbtn.addClickEventListener(this.btnSend.bind(this));

        var btn = ccui.helper.seekWidgetByName(this.Widget, "btn_back");
        btn.addClickEventListener(this.backClick.bind(this));
        return true;
    },
    onEnter:function() {
        this._super();
        Client.addMap("createsaolei", this);
    },
    onExit:function() {
        this._super();
        Client.removeMap("createsaolei", this);
    },
    btn1Click:function() {
        for (var key in this.m_l1) {
            this.m_l1[key].removeFromParent();
        }

        var map = {
            1: {min: 10, max: 100, step: 10},
            2: {min: 100, max: 500, step: 50},
            3: {min: 500, max: 2000, step: 100}
        };

        var x = map[this.m_roomtype];
        if (!x) return;

        for (var i = x.min;i <= x.max;i += x.step) {
            var ui = new saoleisub(i, this.mClick.bind(this));
            ui.setUserData(i);
            this.m_list.insertCustomItem(ui, this.m_list.getIndex(this.m_s1));
            this.m_l1.push(ui);
        }
    },
    btn2Click:function() {
        for (var key in this.m_l2) {
            this.m_l2[key].removeFromParent();
        }

        var ary = [7, 10];
        for (var key in ary) {
            var ui = new saoleisub(ary[key], this.nClick.bind(this));
            ui.setUserData(ary[key]);
            this.m_list.insertCustomItem(ui, this.m_list.getIndex(this.m_s2));
            this.m_l2.push(ui);
        }
    },
    btn3Click:function() {
        for (var key in this.m_l3) {
            this.m_l3[key].removeFromParent();
        }

        var ary = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (var key in ary) {
            var ui = new saoleisub(ary[key], this.bClick.bind(this));
            ui.setUserData(ary[key]);
            this.m_list.insertCustomItem(ui, this.m_list.getIndex(this.m_s3));
            this.m_l3.push(ui);
        }
    },
    mClick:function(sender) {
        var text = sender.getUserData();
        for (var key in this.m_l1) {
            this.m_l1[key].removeFromParent();
        }
        this.m_ft_money.setString(text);
        this.checkVaild();
    },
    nClick:function(sender) {
        var text = sender.getUserData();
        for (var key in this.m_l2) {
            this.m_l2[key].removeFromParent();
        }
        this.m_ft_num.setString(text);
        this.checkVaild();
    },
    bClick:function(sender) {
        var text = sender.getUserData();
        for (var key in this.m_l3) {
            this.m_l3[key].removeFromParent();
        }
        this.m_ft_bomb.setString(text);
        this.checkVaild();
    },
    checkVaild:function() {
        var m = this.m_ft_money.getString();
        var n = this.m_ft_num.getString();
        var b = this.m_ft_bomb.getString();

        var v = true;
        if (m == "0.00" || n == "0") v = false;
        this.m_sendbtn.setTouchEnabled(v);
    },
    btnSend:function() {
        var m = this.m_ft_money.getString();
        var n = this.m_ft_num.getString();
        var b = this.m_ft_bomb.getString();

        m = parseInt(m);
        n = parseInt(n);
        b = parseInt(b);

        Server.gate("createsaolei", {t: RoleInfo.token, type: this.m_subtype, coin: m, num: n, bomb: b});
    },
    createsaolei:function(msg) {
        this.removeFromParent();
    },
    backClick:function() {
        this.removeFromParent();
    }
});