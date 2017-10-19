/**
 * Created by hasee on 2017-10-17.
 */
var chatsysUI = ccui.Widget.extend({
    ctor:function(text) {
        this._super();

        var l = ccs.load("res/chatsys.json");
        this.Widget = l.node;
        this.addChild(this.Widget);

        this.setAnchorPoint(0, 0);
        this.setContentSize(this.Widget.getContentSize());

        var t = ccui.helper.seekWidgetByName(this.Widget, "ft_text");
        t.setString(text);
        return true;
    },
    onEnter:function() {
        this._super();
    },
    onExit:function() {
        this._super();
    }
});