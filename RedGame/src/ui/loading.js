var loadingUI = cc.Layer.extend({
    m_pLoadingBar:null,
    m_pLoadLength:null,
    Widget:null,
    CCSAction:null,

    m_pNode_1:null,
    m_pNode_2:null,
    ctor : function()
    {
        console.log("loading init!!")
        this._super();
        var l = ccs.load("res/loading.json");
        this.CCSAction = l.action;
        this.Widget = l.node;
        this.addChild(this.Widget);

        this.m_pNode_1 = ccui.helper.seekWidgetByName(this.Widget, "Node_1");
        this.m_pNode_2 = ccui.helper.seekWidgetByName(this.Widget, "Node_2");

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
        Client.addMap("tokenlogin", this);
        Client.addMap("wxlogin", this);
        Client.addMap("fastreg", this);

        this.CCSAction.play("run");
    },
    onExit:function()
    {
        this._super();
        Client.removeMap("login", this);
        Client.removeMap("tokenlogin", this);
        Client.removeMap("wxlogin", this);
        Client.removeMap("fastreg", this);
    },
    setPercent:function(percent)
    {
        this.m_pLoadingBar.setPercent(percent);
    },
    ResourceComplete:function()
    {
        Nlog("Load Over");
        this.m_pLoadingBar.setPercent(100);
        if (Login_Type == 1) {
            Server.send("wxlogin", {code: Login_Param.code});
        } else if (Login_Type == 2) {
            Server.send("tokenlogin", {t: Login_Param});
        } else if (Login_Type == 4) {
            Server.send("fastreg", {});
        } else {
            this.m_pNode_1.setVisible(true);
            this.m_pNode_2.setVisible(false);
        }
    },
    wxlogin:function(msg){
        if (msg.code == 0) {
            this.loginSuc(msg);
        }
    },
    tokenlogin:function(msg){
        if (msg.code == 0) {
            this.loginSuc(msg);
        }
    },
    login:function(msg){
        if (msg.code == 0) {
            this.loginSuc(msg);
        }
    },
    fastreg:function(msg){
        if (msg.code == 0) {
            this.loginSuc(msg);
        }
    },
    loginSuc:function(msg) {
        if (msg.code == 0) {
            msg = msg.data;
            RoleInfo.nickname = msg.nickname;
            RoleInfo.gamename = msg.gamename;
            RoleInfo.head = msg.headimg;
            cc.loader.loadImg(RoleInfo.head, {isCrossOrigin : false}, function(err, texture){
                var texture2d = new cc.Texture2D();
                texture2d.initWithElement(texture);
                texture2d.handleLoadedTexture();
                RoleInfo.img = texture2d;
                RoleInfo.notify();
            });
            RoleInfo.sex = msg.sex;
            RoleInfo.uid = msg.uid;

            RoleInfo.token = msg.token;
            RoleInfo.fangka = msg.fangka;
            RoleInfo.money = msg.money;
            g_gate = msg.gate;
        }

        this.removeFromParent();
        var ui = new mainUI();
        uiMgr.mainUI = ui;
        cc.director.getRunningScene().addChild(ui);
    }
});