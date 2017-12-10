/**
 * Created by hasee on 2017-10-17.
 */
var niuniured = ccui.Widget.extend({
    m_l1: null,

    m_list: null,

    m_ft_money: null,

    m_subtype: null,
    m_roomtype: null,
    m_s1: null,

    m_sendbtn:null,
    ctor:function(subtype, roomtype) {
        this._super();

        this.m_subtype = subtype;
        this.m_roomtype = roomtype;

        this.m_l1 = [];

        var l = ccs.load("res/niuniured.json");
        this.Widget = l.node;
        this.addChild(this.Widget);


        this.setContentSize(this.Widget.getContentSize());
        this.setAnchorPoint(0, 0);

        this.m_list = ccui.helper.seekWidgetByName(this.Widget, "ListView_1");
        var p = ccui.helper.seekWidgetByName(this.Widget, "btn_1");
        p.addClickEventListener(this.btn1Click.bind(this));

        this.m_ft_money = ccui.helper.seekWidgetByName(this.Widget, "ft_money");

        this.m_s1 = ccui.helper.seekWidgetByName(this.Widget, "s1");

        this.m_sendbtn = ccui.helper.seekWidgetByName(this.Widget, "btn_send");
        this.m_sendbtn.addClickEventListener(this.btnSend.bind(this));

        var btn = ccui.helper.seekWidgetByName(this.Widget, "btn_back");
        btn.addClickEventListener(this.backClick.bind(this));
        return true;
    },
    onEnter:function() {
        this._super();
        Client.addMap("createniuniu", this);
    },
    onExit:function() {
        this._super();
        Client.removeMap("createniuniu", this);
    },
    btn1Click:function() {
        for (var key in this.m_l1) {
            this.m_l1[key].removeFromParent();
        }

        var map = {
            1: [1, 2, 3, 5, 10, 20],
            2: [30, 50, 100, 200],
            3: [300, 400, 500, 600]
        };

        var x = map[this.m_roomtype];
        if (!x) return;

        for (var i in x) {
            var ui = new saoleisub(x[i], this.mClick.bind(this));
            ui.setUserData(x[i]);
            this.m_list.insertCustomItem(ui, this.m_list.getIndex(this.m_s1));
            this.m_l1.push(ui);
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

        var v = true;
        if (m == "0.00") v = false;
        this.m_sendbtn.setTouchEnabled(v);
    },
    btnSend:function() {
        var m = this.m_ft_money.getString();

        m = parseInt(m);

        Server.gate("createniuniu", {t: RoleInfo.token, type: this.m_subtype, coin: m});
    },
    createniuniu:function(msg) {
        this.removeFromParent();
    },
    backClick:function() {
        this.removeFromParent();
    }
});