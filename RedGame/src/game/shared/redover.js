/**
 * Created by hasee on 2017-10-17.
 */
var redoverUI = ccui.Widget.extend({
    m_type: null,
    m_red: null,
    ctor:function(t, r) {
        this._super();

        this.m_type = t;
        this.m_red = r;

        var l = ccs.load("res/redover.json");
        this.Widget = l.node;
        this.addChild(this.Widget);

        this.setContentSize(this.Widget.getContentSize());

        var btn = ccui.helper.seekWidgetByName(this.Widget, "btn_chakan");
        btn.addClickEventListener(this.btnClick.bind(this));

        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_close");
        btn.addClickEventListener(this.closeClick.bind(this));
        return true;
    },
    onEnter:function() {
        this._super();
    },
    onExit:function() {
        this._super();
    },
    btnClick:function() {
        Server.gate("getdetail", {t: RoleInfo.token, h: this.m_type - 1, r: this.m_red.roomid});
    },
    closeClick:function() {
        this.removeFromParent();
    }
});