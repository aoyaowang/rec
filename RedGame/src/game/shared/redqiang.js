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
        Client.addMap("shaoleiQiangrq", this);
    },
    onExit:function() {
        this._super();
        Client.removeMap("shaoleiQiangrq", this);
    },
    qiangClick:function() {
        if (this.m_type == 1) {
            Server.gate("shaoleiQiangrq", {t: RoleInfo.token, h: this.m_red.halltype, r: this.m_red.roomid});
        }
    },
    shaoleiQiangrq:function() {
        this.removeFromParent();
    },
    closeClick:function() {
        this.removeFromParent();
    }
});