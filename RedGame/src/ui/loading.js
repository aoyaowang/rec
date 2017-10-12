var loadingUI = cc.Layer.extend({
    m_pLoadingBar:null,
    m_pLoadLength:null,
    Widget:null,
    CCSAction:null,
    ctor : function()
    {
        console.log("loading init!!")
        this._super();
        var l = ccs.load("res/loading.json");
        this.CCSAction = l.action;
        this.Widget = l.node;
        this.addChild(this.Widget);

        this.m_pLoadingBar = ccui.helper.seekWidgetByName(this.Widget, "loadbar");
        this.m_pLoadLength = this.m_pLoadingBar.getContentSize().width;
        this.setPercent(0);
        this.Widget.runAction(this.CCSAction);
        return true;
    },
    onEnter:function()
    {
        this._super();
        Client.addMap("login", this);

        this.CCSAction.play("run");
    },
    onExit:function()
    {
        this._super();
        Client.removeMap("login", this);
    },
    setPercent:function(percent)
    {
        this.m_pLoadingBar.setPercent(percent);
    },
    ResourceComplete:function()
    {
        Nlog("Load Over");
        this.m_pLoadingBar.setPercent(100);

        Server.send("login", {});
    },
    login:function(msg){
        if (msg.code == 0) {
            msg = msg.data;
            RoleInfo.nickname = msg.nickname;
            RoleInfo.head = msg.head;
            RoleInfo.sex = msg.sex;
            RoleInfo.userid = msg.userid;

            RoleInfo.token = msg.token;
            RoleInfo.fangka = msg.fangka;
            RoleInfo.money = msg.money;
        }

        this.removeFromParent();
        var ui = new mainUI();
        cc.director.getRunningScene().addChild(ui);
    }
});