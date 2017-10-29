/**
 * Created by hasee on 2017-10-17.
 */
var redqiangUI = ccui.Widget.extend({
    m_type: null,
    m_red:null,
    ctor:function(type, r) {
        this._super();

        this.m_type = type;
        this.m_red = r;

        var l = ccs.load("res/redqiang.json");
        this.Widget = l.node;
        this.addChild(this.Widget);


        this.setContentSize(this.Widget.getContentSize());
        this.setAnchorPoint(0, 0);

        var btn = ccui.helper.seekWidgetByName(this.Widget, "btn_qiang");
        btn.addClickEventListener(this.qiangClick.bind(this));

        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_close");
        btn.addClickEventListener(this.closeClick.bind(this));
        return true;
    },
    onEnter:function() {
        this._super();
        Client.addMap("saoleiQiangrq", this);
        Client.addMap("jielongQiangrq", this);
    },
    onExit:function() {
        this._super();
        Client.removeMap("saoleiQiangrq", this);
        Client.removeMap("jielongQiangrq", this);
    },
    qiangClick:function() {
        if (this.m_type == 1) {
            Server.gate("saoleiQiangrq", {t: RoleInfo.token, h: this.m_red.halltype, r: this.m_red.roomid});
        }
        else if (this.m_type == 2) {
            Server.gate("jielongQiangrq", {t: RoleInfo.token, h: this.m_red.halltype, r: this.m_red.roomid});
        }
        else if (this.m_type == 3 || this.m_type == 4) {
            Server.gate("saoleiQiangrq", {t: RoleInfo.token, h: this.m_red.halltype, r: this.m_red.roomid});
        }
    },
    jielongQiangrq:function() {
        this.removeFromParent();
    },
    saoleiQiangrq:function() {
        this.removeFromParent();
    },
    closeClick:function() {
        this.removeFromParent();
    }
});