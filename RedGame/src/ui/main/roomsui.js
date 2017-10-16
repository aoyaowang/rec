/**
 * Created by hasee on 2017-10-16.
 */
var roomsUI = cc.Layer.extend({
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

        return true;
    },
    onEnter:function() {
        this._super();
    },
    onExit:function() {
        this._super();
    },
    BtnLv1Click:function() {
        var name = GAME_INFO[this.m_type].name;
        if (this.m_lv1.length == 0) {
            var l = GAME_INFO[this.m_type].list[1];
            for (var i = 0;i < l.length;i+=3) {
                var a = l[i];
                var b = l[i+1];
                var c = l[i+2];
                var map = [a ? {name: name + a[0] + "元" + a[1] + "包", num: 0, cb: this.roomClick, target: this, tag: JSON.stringify(a)} : null,
                            b ? {name: name + b[0] + "元" + b[1] + "包", num: 0, cb: this.roomClick, target: this, tag: JSON.stringify(b)} : null,
                            c ? {name: name + c[0] + "元" + c[1] + "包", num: 0, cb: this.roomClick, target: this, tag: JSON.stringify(c)} : null];
                var ui = new roomitemUI(map);
                this.m_lv1.push(ui);
                this.m_listview.insertBefore(ui, this.m_panel2);
            }
        } else {
            for (var key in this.m_lv1) {
                this.m_lv1[key].removeFromParent();
            }
        }
    },
    BtnLv2Click:function() {
        var name = GAME_INFO[this.m_type].name;
        if (this.m_lv2.length == 0) {
            var l = GAME_INFO[this.m_type].list[2];
            for (var i = 0;i < l.length;i+=3) {
                var a = l[i];
                var b = l[i+1];
                var c = l[i+2];
                var map = [a ? {name: name + a[0] + "元" + a[1] + "包", num: 0, cb: this.roomClick, target: this, tag: JSON.stringify(a)} : null,
                    b ? {name: name + b[0] + "元" + b[1] + "包", num: 0, cb: this.roomClick, target: this, tag: JSON.stringify(b)} : null,
                    c ? {name: name + c[0] + "元" + c[1] + "包", num: 0, cb: this.roomClick, target: this, tag: JSON.stringify(c)} : null];
                var ui = new roomitemUI(map);
                this.m_lv2.push(ui);
                this.m_listview.insertBefore(ui, this.m_panel3);
            }
        } else {
            for (var key in this.m_lv2) {
                this.m_lv2[key].removeFromParent();
            }
        }
    },
    BtnLv3Click:function() {
        var name = GAME_INFO[this.m_type].name;
        if (this.m_lv3.length == 0) {
            var l = GAME_INFO[this.m_type].list[3];
            for (var i = 0;i < l.length;i+=3) {
                var a = l[i];
                var b = l[i+1];
                var c = l[i+2];
                var map = [a ? {name: name + a[0] + "元" + a[1] + "包", num: 0, cb: this.roomClick, target: this, tag: JSON.stringify(a)} : null,
                    b ? {name: name + b[0] + "元" + b[1] + "包", num: 0, cb: this.roomClick, target: this, tag: JSON.stringify(b)} : null,
                    c ? {name: name + c[0] + "元" + c[1] + "包", num: 0, cb: this.roomClick, target: this, tag: JSON.stringify(c)} : null];
                var ui = new roomitemUI(map);
                this.m_lv3.push(ui);
                this.m_listview.addChild(ui);
            }
        } else {
            for (var key in this.m_lv3) {
                this.m_lv3[key].removeFromParent();
            }
        }
    },
    roomClick:function(sender) {

    },
    BackClick:function() {
        this.removeFromParent();
    }
});