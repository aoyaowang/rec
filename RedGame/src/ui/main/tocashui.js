/**
 * Created by hasee on 2017-10-21.
 */
var tocashUI = ccui.Widget.extend({
    m_img_head: null,
    m_ft_uid: null,
    m_ft_nickname: null,
    m_ft_bill: null,
    m_ft_to: null,
    ctor:function() {
        this._super();

        var l = ccs.load("res/tocash.json");
        this.Widget = l.node;
        this.addChild(this.Widget);


        this.setContentSize(this.Widget.getContentSize());
        this.setAnchorPoint(0, 0);

        this.m_img_head = ccui.helper.seekWidgetByName(this.Widget, "img_head");
        this.m_ft_uid = ccui.helper.seekWidgetByName(this.Widget, "ft_uid");
        this.m_ft_nickname = ccui.helper.seekWidgetByName(this.Widget, "ft_nickname");
        this.m_ft_bill = ccui.helper.seekWidgetByName(this.Widget, "ft_bill");
        this.m_ft_to = ccui.helper.seekWidgetByName(this.Widget, "ft_to");

        var btn = ccui.helper.seekWidgetByName(this.Widget, "btn_bill");
        btn.addClickEventListener(this.billClick.bind(this));

        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_10");
        btn.addClickEventListener(this.moneyClick.bind(this));
        btn.setUserData(10);
        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_20");
        btn.addClickEventListener(this.moneyClick.bind(this));
        btn.setUserData(20);
        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_50");
        btn.addClickEventListener(this.moneyClick.bind(this));
        btn.setUserData(50);
        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_100");
        btn.addClickEventListener(this.moneyClick.bind(this));
        btn.setUserData(100);
        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_500");
        btn.addClickEventListener(this.moneyClick.bind(this));
        btn.setUserData(500);
        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_1000");
        btn.addClickEventListener(this.moneyClick.bind(this));
        btn.setUserData(1000);

        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_back");
        btn.addClickEventListener(this.backClick.bind(this));
        return true;
    },
    onEnter:function() {
        this._super();
        RoleInfo.addOb(this.RoleInfoChange, this);
        Client.addMap("turnto", this);
    },
    onExit:function() {
        this._super();
        RoleInfo.removeOb(this.RoleInfoChange, this);
        Client.removeMap("turnto", this);
    },
    backClick:function(){
        this.removeFromParent();
    },
    turnto:function(msg) {
        if (msg.code != 0) return;
        Client.ShowMessage("转账成功");
    },
    billClick:function() {
        var bill = this.m_ft_bill.getString();
        if (this.m_ft_to.getString() == "") return;
        if (parseInt(bill) <= 0) return;
        Server.gate("turnto", {t: RoleInfo.token, m: bill, uid: this.m_ft_to.getString()});
    },
    moneyClick:function(sender) {
        var m = sender.getUserData();
        this.m_ft_bill.setString(m);
    },
    RoleInfoChange:function(info) {
        if (RoleInfo.img) {
            var size = RoleInfo.img.getContentSize();
            this.m_img_head.setTexture(RoleInfo.img);
            this.m_img_head.setTextureRect(cc.rect(0,0,size.width, size.height));
            var msize = this.m_img_head.getContentSize();
            this.m_img_head.setScale(Math.min(64/msize.width,64/msize.height) );
        }
        this.m_ft_nickname.setString(RoleInfo.gamename == "" ? RoleInfo.nickname : RoleInfo.gamename);
        this.m_ft_uid.setString(RoleInfo.uid);
    }
});