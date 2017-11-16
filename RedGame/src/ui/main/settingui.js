/**
 * Created by hasee on 2017-10-15.
 */
var settingUI = ccui.Widget.extend({
    m_ft_name:null,
    m_img_head:null,
    m_ft_fangka:null,
    m_ft_money:null,
    m_ft_id:null,
    m_listview: null,
    m_ay:null,
    ctor:function() {
        this._super();
        this.m_ay = [];
        var l = ccs.load("res/setting.json");
        this.Widget = l.node;
        this.addChild(this.Widget);


        this.setContentSize(this.Widget.getContentSize());
        this.setAnchorPoint(0, 0);

        this.m_ft_name = ccui.helper.seekWidgetByName(this.Widget, "ft_name");
        this.m_img_head = ccui.helper.seekWidgetByName(this.Widget, "img_head");
        this.m_ft_fangka = ccui.helper.seekWidgetByName(this.Widget, "ft_fangka");
        this.m_ft_money = ccui.helper.seekWidgetByName(this.Widget, "ft_money");
        this.m_ft_id = ccui.helper.seekWidgetByName(this.Widget, "ft_id");

        var btn = ccui.helper.seekWidgetByName(this.Widget, "btn_bill");
        btn.addClickEventListener(this.billClick.bind(this));
        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_tocash");
        btn.addClickEventListener(this.toCashClick.bind(this));

        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_game1");
        btn.addClickEventListener(this.game1Click.bind(this));
        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_game2");
        btn.addClickEventListener(this.game2Click.bind(this));
        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_game3");
        btn.addClickEventListener(this.game3Click.bind(this));
        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_game4");
        btn.addClickEventListener(this.game4Click.bind(this));

        this.m_listview = ccui.helper.seekWidgetByName(this.Widget, "listview");
        return true;
    },
    onEnter:function() {
        this._super();
        RoleInfo.addOb(this.RoleInfoChange, this);
        Client.addMap("getlog", this);
    },
    onExit:function() {
        this._super();
        RoleInfo.removeOb(this.RoleInfoChange, this);
        Client.removeMap("getlog", this);
    },
    RoleInfoChange:function(role) {
        if (RoleInfo.img) {
            var size = RoleInfo.img.getContentSize();
            this.m_img_head.setTexture(RoleInfo.img);
            this.m_img_head.setTextureRect(cc.rect(0,0,size.width, size.height));
            var msize = this.m_img_head.getContentSize();
            this.m_img_head.setScale(Math.min(150/msize.width,150/msize.height) );
        }
        this.m_ft_name.setString(RoleInfo.gamename == "" ? RoleInfo.nickname : RoleInfo.gamename);
        this.m_ft_fangka.setString(RoleInfo.fangka);
        this.m_ft_money.setString(RoleInfo.money);
        this.m_ft_id.setString(RoleInfo.uid);
    },
    billClick:function() {
        var ui = new billUI();
        this.Widget.addChild(ui);
    },
    toCashClick:function() {
        var ui = new tocashUI();
        this.Widget.addChild(ui);
    },
    game1Click:function(msg) {
        Server.send("getlog", {token: RoleInfo.token, game: "saolei"});
    },
    game2Click:function(msg) {
        Server.send("getlog", {token: RoleInfo.token, game: "jielong"});
    },
    game3Click:function(msg) {
        Server.send("getlog", {token: RoleInfo.token, game: "niuniu"});
    },
    game4Click:function(msg) {
        Server.send("getlog", {token: RoleInfo.token, game: "28"});
    },
    getlog:function(msg) {
        if (msg.code !=0) return;
        for (var xx in this.m_ay) {
            this.m_listview.removeChild(this.m_ay[xx]);
        }
        this.m_ay = [];
        //this.m_listview.removeAllChildren();
        for (var i in msg.data) {
            var a = msg.data[i];
            var newDate = new Date();
            newDate.setTime(a.time * 1000);
            var ttt= newDate.format("M/d h:m:s");


            var ui = new logUI(a.roomid, a.game, ttt, a.coin, a.money);
            this.m_listview.pushBackCustomItem(ui);
            this.m_ay.push(ui);
        }
    }
});