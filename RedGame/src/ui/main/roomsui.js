/**
 * Created by hasee on 2017-10-16.
 */
var roomsUI = ccui.Widget.extend({
    m_btn_lv1:null,
    m_btn_lv1_add:null,
    m_btn_lv2:null,
    m_btn_lv2_add:null,
    m_btn_lv3:null,
    m_btn_lv3_add:null,

    m_lv1: null,
    m_lv2: null,
    m_lv3: null,
    m_type: null,

    m_listview:null,

    m_panel2:null,
    m_panel3:null,
    ctor:function(type) {
        this._super();
        this.m_type = type;
        var l = ccs.load("res/rooms.json");
        this.Widget = l.node;
        this.addChild(this.Widget);


        this.setContentSize(this.Widget.getContentSize());
        this.setAnchorPoint(0, 0);

        this.m_lv1 = [];
        this.m_lv2 = [];
        this.m_lv3 = [];

        var btn = ccui.helper.seekWidgetByName(this.Widget, "btn_back");
        btn.addClickEventListener(this.BackClick.bind(this));

        this.m_listview = ccui.helper.seekWidgetByName(this.Widget, "ListView_1");
        this.m_panel2 = ccui.helper.seekWidgetByName(this.Widget, "Panel_2");
        this.m_panel3 = ccui.helper.seekWidgetByName(this.Widget, "Panel_3");

        this.m_btn_lv1 = ccui.helper.seekWidgetByName(this.Widget, "btn_lv1");
        this.m_btn_lv1_add = ccui.helper.seekWidgetByName(this.Widget, "btn_lv1_ad");
        this.m_btn_lv1.addClickEventListener(this.BtnLv1Click.bind(this));
        this.m_btn_lv1_add.addClickEventListener(this.BtnLv1Click.bind(this));

        this.m_btn_lv2 = ccui.helper.seekWidgetByName(this.Widget, "btn_lv2");
        this.m_btn_lv2_add = ccui.helper.seekWidgetByName(this.Widget, "btn_lv2_ad");
        this.m_btn_lv2.addClickEventListener(this.BtnLv2Click.bind(this));
        this.m_btn_lv2_add.addClickEventListener(this.BtnLv2Click.bind(this));

        this.m_btn_lv3 = ccui.helper.seekWidgetByName(this.Widget, "btn_lv3");
        this.m_btn_lv3_add = ccui.helper.seekWidgetByName(this.Widget, "btn_lv3_ad");
        this.m_btn_lv3.addClickEventListener(this.BtnLv3Click.bind(this));
        this.m_btn_lv3_add.addClickEventListener(this.BtnLv3Click.bind(this));

        if (this.m_type == 2) {
            this.initType2();
        }
        return true;
    },
    onEnter:function() {
        this._super();
        Client.addMap("joinroom", this);
    },
    onExit:function() {
        this._super();
        console.log("OnExit RoomUI");
        Client.removeMap("joinroom", this);

        uiMgr.roomUI = null;
    },
    initType2:function() {
        this.m_listview.removeAllChildren();
        var l = GAME_INFO[this.m_type].list;
        for (var i = 0;i < l.length;i+=3) {
            var a = l[i];
            var b = l[i+1];
            var c = l[i+2];
            var map = [a ? {name: name + " " + a + "币5包", num: 0, cb: this.roomClick, target: this, tag: a} : null,
                b ? {name: name + " " + b + "币5包", num: 0, cb: this.roomClick, target: this, tag: b} : null,
                c ? {name: name + " " + c + "币5包", num: 0, cb: this.roomClick, target: this, tag: c} : null];
            var ui = new roomitemUI(map);
            this.m_listview.pushBackCustomItem(ui);
        }
    },
    BtnLv1Click:function() {
        if (this.m_type == 1 || this.m_type == 3 || this.m_type == 4) {
            Server.gate("joinroom", {t: RoleInfo.token, id: parseInt(this.m_type) - 1, type: 1});
        }
    },
    BtnLv2Click:function() {
        if (this.m_type == 1 || this.m_type == 3 || this.m_type == 4) {
            Server.gate("joinroom", {t: RoleInfo.token, id: parseInt(this.m_type) - 1, type: 2});
        }
        else if (this.m_type == 3) {

        }
    },
    BtnLv3Click:function() {
        if (this.m_type == 1 || this.m_type == 3 || this.m_type == 4) {
            Server.gate("joinroom", {t: RoleInfo.token, id: parseInt(this.m_type) - 1, type: 3});
        }
    },
    roomClick:function(sender) {
        if (this.m_type == 2) {
            Server.gate("joinroom", {t: RoleInfo.token, id: parseInt(this.m_type) - 1, type: sender.getTag()});
        }
    },
    BackClick:function() {
        this.removeFromParent();
    },
    joinroom:function(msg, req) {
        if (msg.code == 0) {
            if (this.m_type == 1) {
                var rn = req.type == 1 ? "初级房" : req.type == 2 ? "中级房" : "高级房";
                var ui = new saoleiUI(this.m_type, req.type, "王者扫雷" + rn);
                uiMgr.mainUI.m_game.addChild(ui);
            }
            else if (this.m_type == 2) {
                var rn = req.type + "币5包";
                var ui = new jielongUI(this.m_type, req.type, "王者接龙 " + rn);
                uiMgr.mainUI.m_game.addChild(ui);
            }
            else if (this.m_type == 3) {
                var rn = req.type == 1 ? "初级房(1-20币)" : req.type == 2 ? "中级房(30-200币)" : "高级房(300-600币)";
                var ui = new niuniuUI(this.m_type, req.type, "王者牛牛" + rn);
                uiMgr.mainUI.m_game.addChild(ui);
            }
            else if (this.m_type == 4) {
                var rn = req.type == 1 ? "初级房(1-20币)" : req.type == 2 ? "中级房(30-200币)" : "高级房(300-600币)";
                var ui = new game28UI(this.m_type, req.type, "王者二八" + rn);
                uiMgr.mainUI.m_game.addChild(ui);
            }
        }
    }
});