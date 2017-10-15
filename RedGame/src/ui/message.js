/**
 * Created by hasee on 2017-10-14.
 */
var messageUI = cc.Layer.extend({
    m_pText:null,
    ctor:function(msg) {
        this._super();

        var l = ccs.load("res/message.json");
        this.Widget = l.node;
        this.addChild(this.Widget);

        this.m_pText = ccui.helper.seekWidgetByName(this.Widget, "Text_1");
        this.m_pText.setText(msg);
        var btn = ccui.helper.seekWidgetByName(this.Widget, "btn_ok");
        btn.addClickEventListener(this.BtnClick.bind(this));

        return true;
    },
    BtnClick:function() {
        this.removeFromParent();
    }
});