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

        this.setAnchorPoint(0, 0);
        this.setContentSize(this.Widget.getContentSize());

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
        Client.addMap("joinroom", this);
    },
    onExit:function() {
        this._super();
        Client.removeMap("joinroom", this);
    },
    BtnLv1Click:function() {
        if (this.m_type == 1) {
            Server.gate("joinroom", {t: RoleInfo.token, id: this.m_type, type: 1});
        }
        else if (this.m_type == 2) {
            var name = GAME_INFO[this.m_type].name;
            if (this.m_lv1.length == 0) {
                var l = GAME_INFO[this.m_type].list[1];
                for (var i = 0;i < l.length;i+=3) {
                    var a = l[i];
                    var b = l[i+1];
                    var c = l[i+2];
                    var map = [a ? {name: name + a[0] + "Ԫ" + a[1] + "��", num: 0, cb: this.roomClick, target: this, tag: JSON.stringify(a)} : null,
                        b ? {name: name + b[0] + "Ԫ" + b[1] + "��", num: 0, cb: this.roomClick, target: this, tag: JSON.stringify(b)} : null,
                        c ? {name: name + c[0] + "Ԫ" + c[1] + "��", num: 0, cb: this.roomClick, target: this, tag: JSON.stringify(c)} : null];
                    var ui = new roomitemUI(map);
                    this.m_lv1.push(ui);
                    this.m_listview.insertCustomItem(ui, this.m_listview.getIndex(this.m_panel2));
                }
            } else {
                for (var key in this.m_lv1) {
                    this.m_lv1[key].removeFromParent();
                }
            }
        }

    },
    BtnLv2Click:function() {
        if (this.m_type == 1) {
            Server.gate("joinroom", {t: RoleInfo.token, id: this.m_type, type: 2});
        }
        else if (this.m_type == 2) {
            var name = GAME_INFO[this.m_type].name;
            if (this.m_lv2.length == 0) {
                var l = GAME_INFO[this.m_type].list[2];
                for (var i = 0; i < l.length; i += 3) {
                    var a = l[i];
                    var b = l[i + 1];
                    var c = l[i + 2];
                    var map = [a ? {
                        name: name + a[0] + "Ԫ" + a[1] + "��",
                        num: 0,
                        cb: this.roomClick,
                        target: this,
                        tag: JSON.stringify(a)
                    } : null,
                        b ? {
                            name: name + b[0] + "Ԫ" + b[1] + "��",
                            num: 0,
                            cb: this.roomClick,
                            target: this,
                            tag: JSON.stringify(b)
                        } : null,
                        c ? {
                            name: name + c[0] + "Ԫ" + c[1] + "��",
                            num: 0,
                            cb: this.roomClick,
                            target: this,
                            tag: JSON.stringify(c)
                        } : null];
                    var ui = new roomitemUI(map);
                    this.m_lv2.push(ui);
                    this.m_listview.insertCustomItem(ui, this.m_listview.getIndex(this.m_panel3));
                }
            } else {
                for (var key in this.m_lv2) {
                    this.m_lv2[key].removeFromParent();
                }
            }
        }
    },
    BtnLv3Click:function() {
        if (this.m_type == 1) {
            Server.gate("joinroom", {t: RoleInfo.token, id: this.m_type, type: 3});
        }
        else if (this.m_type == 2) {
            var name = GAME_INFO[this.m_type].name;
            if (this.m_lv3.length == 0) {
                var l = GAME_INFO[this.m_type].list[3];
                for (var i = 0; i < l.length; i += 3) {
                    var a = l[i];
                    var b = l[i + 1];
                    var c = l[i + 2];
                    var map = [a ? {
                        name: name + a[0] + "Ԫ" + a[1] + "��",
                        num: 0,
                        cb: this.roomClick,
                        target: this,
                        tag: JSON.stringify(a)
                    } : null,
                        b ? {
                            name: name + b[0] + "Ԫ" + b[1] + "��",
                            num: 0,
                            cb: this.roomClick,
                            target: this,
                            tag: JSON.stringify(b)
                        } : null,
                        c ? {
                            name: name + c[0] + "Ԫ" + c[1] + "��",
                            num: 0,
                            cb: this.roomClick,
                            target: this,
                            tag: JSON.stringify(c)
                        } : null];
                    var ui = new roomitemUI(map);
                    this.m_lv3.push(ui);
                    this.m_listview.pushBackCustomItem(ui);
                }
            } else {
                for (var key in this.m_lv3) {
                    this.m_lv3[key].removeFromParent();
                }
            }
        }
    },
    roomClick:function(sender) {

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
        }
    }
});