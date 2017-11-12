/**
 * Created by hasee on 2017-10-12.
 */

var mainUI = cc.Layer.extend({
    m_ftName:null,
    m_Head:null,
    m_FangKa:null,
    m_Money:null,

    m_actionui:null,
    m_actionBtn:null,

    m_hallui:null,
    m_hallBtn:null,

    m_marketui:null,
    m_marketBtn:null,

    m_settingui:null,
    m_settingBtn:null,

    m_sysui:null,
    m_sysBtn:null,

    m_game:null,
    ctor:function() {
        this._super();

        var l = ccs.load("res/main.json");
        this.Widget = l.node;
        this.addChild(this.Widget);

        this.m_Head = ccui.helper.seekWidgetByName(this.Widget, "img_head");
        this.m_ftName = ccui.helper.seekWidgetByName(this.Widget, "ft_name");
        this.m_FangKa = ccui.helper.seekWidgetByName(this.Widget, "ft_fangka");
        this.m_Money = ccui.helper.seekWidgetByName(this.Widget, "ft_money");

        var panel = ccui.helper.seekWidgetByName(this.Widget, "Panel_1");
        var base = ccui.helper.seekWidgetByName(this.Widget, "base");

        this.m_actionui = new actionUI();
        panel.addChild(this.m_actionui);
        this.m_actionBtn = ccui.helper.seekWidgetByName(this.Widget, "btn_action");
        this.m_actionBtn.addClickEventListener(this.onSwitchClick.bind(this));

        this.m_hallui = new hallUI();
        panel.addChild(this.m_hallui);
        this.m_hallBtn = ccui.helper.seekWidgetByName(this.Widget, "btn_main");
        this.m_hallBtn.addClickEventListener(this.onSwitchClick.bind(this));

        this.m_marketui = new marketUI();
        panel.addChild(this.m_marketui);
        this.m_marketBtn = ccui.helper.seekWidgetByName(this.Widget, "btn_market");
        this.m_marketBtn.addClickEventListener(this.onSwitchClick.bind(this));

        this.m_settingui = new settingUI();
        base.addChild(this.m_settingui);
        this.m_settingBtn = ccui.helper.seekWidgetByName(this.Widget, "btn_setting");
        this.m_settingBtn.addClickEventListener(this.onSwitchClick.bind(this));

        this.m_sysui = new sysUI();
        panel.addChild(this.m_sysui);
        this.m_sysBtn = ccui.helper.seekWidgetByName(this.Widget, "btn_gonggao");
        this.m_sysBtn.addClickEventListener(this.onSwitchClick.bind(this));
        this.changeUI(0);

        this.m_game = ccui.helper.seekWidgetByName(this.Widget, "game");

        Server.gate("entergame", {t:RoleInfo.token});
        return true;
    },
    onEnter:function() {
        this._super();
        RoleInfo.addOb(this.RoleInfoChange, this);
        Client.addMap("entergame", this);
    },
    onExit:function() {
        this._super();
        RoleInfo.removeOb(this.RoleInfoChange, this);
        Client.removeMap("entergame", this);
    },
    RoleInfoChange:function(role) {
        if (RoleInfo.img) {
            var size = RoleInfo.img.getContentSize();
            this.m_Head.setTexture(RoleInfo.img);
            this.m_Head.setTextureRect(cc.rect(0,0,size.width, size.height));
            var msize = this.m_Head.getContentSize();
            this.m_Head.setScale(Math.min(64/msize.width,64/msize.height) );
        }
        this.m_ftName.setString(RoleInfo.gamename == "" ? RoleInfo.nickname : RoleInfo.gamename);
        this.m_FangKa.setString(RoleInfo.fangka);
        this.m_Money.setString(RoleInfo.money);
    },
    onSwitchClick:function(sender) {
        var i = 0;
        if (sender == this.m_hallBtn) i = 0;
        else if (sender == this.m_settingBtn) i = 1;
        else if (sender == this.m_sysBtn) i = 2;
        else if (sender == this.m_marketBtn) i = 3;
        else if (sender == this.m_actionBtn) i = 4;

        this.changeUI(i);
    },
    changeUI:function(index) {
        var h = ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT;
        var n = ccui.Widget.BRIGHT_STYLE_NORMAL;
        this.m_actionBtn.setBrightStyle(index == 4 ? h : n);
        this.m_hallBtn.setBrightStyle(index == 0 ? h : n);
        this.m_settingBtn.setBrightStyle(index == 1 ? h : n);
        this.m_sysBtn.setBrightStyle(index == 2 ? h : n);
        this.m_marketBtn.setBrightStyle(index == 3 ? h : n);

        this.m_hallui.setVisible(index == 0);
        this.m_settingui.setVisible(index == 1);
        this.m_sysui.setVisible(index == 2);
        this.m_marketui.setVisible(index == 3);
        this.m_actionui.setVisible(index == 4);
    },
    entergame:function(msg) {
        if (msg.code == 0) {
            RoleInfo.logined = true;
            RoleInfo.beginSync();
        }
    }
});