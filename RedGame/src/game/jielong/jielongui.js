/**
 * Created by hasee on 2017-10-17.
 */
var jielongUI = ccui.Widget.extend({
    m_title:null,
    m_list:null,
    m_ft_money:null,
    m_btn_start:null,

    m_type:null,
    m_subtype:null,

    m_redlist:null,
    ctor:function(type, subtype, title) {
        this._super();

        this.m_type = type;
        this.m_subtype = subtype;

        var l = ccs.load("res/jielong.json");
        this.Widget = l.node;
        this.addChild(this.Widget);


        this.setContentSize(this.Widget.getContentSize());
        this.setAnchorPoint(0, 0);

        this.m_list = ccui.helper.seekWidgetByName(this.Widget, "chatview");
        this.m_list.loadTextureBackGround("backGround/redBag.jpg");
        this.m_ft_money = ccui.helper.seekWidgetByName(this.Widget, "ft_money");
        this.m_ft_money.setString(RoleInfo.money);
        this.m_title = ccui.helper.seekWidgetByName(this.Widget, "ft_title");
        this.m_title.setString(title);
        this.m_btn_start = ccui.helper.seekWidgetByName(this.Widget, "btn_start");
        this.m_btn_start.addClickEventListener(this.startBtn.bind(this));

        var btnred = ccui.helper.seekWidgetByName(this.Widget, "btn_red");
        btnred.addClickEventListener(this.redClick.bind(this));
        var btnlog = ccui.helper.seekWidgetByName(this.Widget, "btn_log");
        btnlog.addClickEventListener(this.logClick.bind(this));

        var btn = ccui.helper.seekWidgetByName(this.Widget, "btn_back");
        btn.addClickEventListener(this.backClick.bind(this));

        this.m_redlist = {};
        return true;
    },
    onEnter:function() {
        this._super();
        RoleInfo.addOb(this.infoChange, this);
        Client.addMap("jielongcreate", this);
        Client.addMap("playerenter", this);
        Client.addMap("playerleave", this);

        Client.addMap("jielongQiangrq", this);
        Client.addMap("jielongqiang", this);
        Client.addMap("jielongotherqiang", this);
        Client.addMap("jielongover", this);
        Client.addMap("getdetail", this);
        var msg = new chatsysUI(RoleInfo.username() + " 进入房间");
        this.m_list.pushBackCustomItem(msg);
    },
    onExit:function() {
        this._super();
        RoleInfo.removeOb(this.infoChange, this);
        Client.removeMap("jielongcreate", this);
        Client.removeMap("playerenter", this);
        Client.removeMap("playerleave", this);

        Client.removeMap("jielongQiangrq", this);
        Client.removeMap("jielongqiang", this);
        Client.removeMap("jielongotherqiang", this);
        Client.removeMap("jielongover", this);
        Client.removeMap("getdetail", this);
    },
    backClick:function(){
        this.removeFromParent();
    },
    infoChange:function() {
        this.m_ft_money.setString(RoleInfo.money);
    },
    playerenter:function(msg) {
        if (!msg || !msg.data) return;
        msg = msg.data;
        var msg = new chatsysUI((msg.gamename == "" ? msg.nickname : msg.gamename) + " 进入房间");
        this.m_list.pushBackCustomItem(msg);
    },
    playerleave:function(msg) {
        if (!msg || !msg.data) return;
        msg = msg.data;
        var c = new chatsysUI((msg.gamename == "" ? msg.nickname : msg.gamename) + " 离开房间");
        this.m_list.pushBackCustomItem(c);
    },
    jielongcreate:function(msg){
        if (!msg || !msg.data) return;
        this.m_btn_start.setVisible(false);
        msg = msg.data;
        var coin = msg.coin;
        var num = msg.num;
        var bomb = msg.bomb;
        var owner = msg.owner;
        var red = "游戏开始,祝你好运";

        this.m_redlist[msg.RoomID] = {
            coin: coin,
            num: num,
            bomb: bomb,
            owner: owner,
            msg: msg,
            roomid: msg.RoomID,
            halltype: msg.HallType,
            state: 0
        };
        headMgr.loadHead(owner.uid, owner.headimg, function(data){
            var c = new chatredUI(data, owner.gamename == "" ? owner.nickname : owner.gamename, red, "王者接龙", this.packetClick.bind(this));
            c.setUserData({halltype: msg.HallType, roomid: msg.RoomID});
            this.m_redlist[msg.RoomID].target = c;
            this.m_list.pushBackCustomItem(c);
        }.bind(this));
    },
    redClick:function() {
        var ui = new saoleired(this.m_type);
        this.Widget.addChild(ui);
    },
    logClick:function() {
        this.removeFromParent();
        uiMgr.mainUI.changeUI(1);
    },
    packetClick:function(sender) {
        var data = sender.getUserData();
        var r = this.m_redlist[data.roomid];
        if (r.state == 0) {
            var ui = new redqiangUI(this.m_type,r);
            this.Widget.addChild(ui, 99);
            //Server.gate("saoleiQiangrq", {t: RoleInfo.token, h: data.halltype, r: data.roomid});
        }
        else if (r.state == 1) { //没有抢到，已经没了
            var ui = new redoverUI(this.m_type,r);
            this.Widget.addChild(ui, 99);
        }
        else if (r.state == 2) { //抢到了
            Server.gate("getdetail", {t: RoleInfo.token, h: data.halltype, r: data.roomid});
        }
        else if (r.state == 3 && r.detail) {
            var ui = new reddetailUI(r.detail, r);
            this.Widget.addChild(ui, 99);
        }
    },
    jielongQiangrq:function(msg) {
        //NOTUSED
    },
    jielongqiang:function(msg) {
        var id = msg.RoomID;
        if (!this.m_redlist[id]) return;
        var money = msg.data.qiang;
        var data = msg.other;
        var coin = msg.coin;
        var num = msg.num;

        this.m_redlist[id].state = 2;

        var ui = new redopenUI(this.m_type,id, money, coin, num, data, this.m_redlist[id]);
        this.Widget.addChild(ui, 99);
    },
    jielongover:function(msg) {
        var id = msg.roomid;
        if (!this.m_redlist[id]) return;
        this.m_redlist[id].state = this.m_redlist[id].state == 0 ? 1 : this.m_redlist[id].state;
        var text = msg.owner.gamename == "" ? msg.owner.nickname : msg.owner.gamename;
        if (!msg.over) {
            var ui = new chatsysUI("游戏包过期，游戏停止");
            this.m_list.pushBackCustomItem(ui);

            this.m_btn_start.setVisible(true);
        }
    },
    jielongotherqiang:function(msg){
        var id = msg.RoomID;
        if (!this.m_redlist[id]) return;
        var onick = this.m_redlist[id].owner.gamename == "" ? this.m_redlist[id].owner.nickname : this.m_redlist[id].owner.gamename;
        var text = (msg.user.gamename == "" ? msg.user.nickname : msg.user.gamename) + " 抢了 " + onick + "的红包！";
        var ui = new chatsysUI(text);
        this.m_list.pushBackCustomItem(ui);
    },
    getdetail:function(msg) {
        if (msg.code !=0 ) return;
        msg = msg.data;
        var id = msg.roomid;
        if (!this.m_redlist[id]) return;
        if (msg.over) {
            this.m_redlist[id].state = 3;
            this.m_redlist[id].detail = msg;
        }
        var ui = new reddetailUI(msg, this.m_redlist[id]);
        this.Widget.addChild(ui, 99);
    },
    startBtn:function() {
        Server.gate("createjielong", {t: RoleInfo.token, type: this.m_type, coin: this.m_subtype});
    }
});