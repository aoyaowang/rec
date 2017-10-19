/**
 * Created by hasee on 2017-10-17.
 */
var saoleisub = ccui.Widget.extend({
    m_cb: null,
    ctor:function(text, cb) {
        this._super();

        this.m_cb = cb;

        var l = ccs.load("res/saoleisub.json");
        this.Widget = l.node;
        this.addChild(this.Widget);

        this.setContentSize(this.Widget.getContentSize());

        var t = ccui.helper.seekWidgetByName(this.Widget, "ft_text");
        t.setString(text);

        t = ccui.helper.seekWidgetByName(this.Widget, "btn_p");
        t.addClickEventListener(this.btnClick.bind(this));

        return true;
    },
    onEnter:function() {
        this._super();
    },
    onExit:function() {
        this._super();
    },
    btnClick:function() {
        this.m_cb(this);
    }
});