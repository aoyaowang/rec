/**
 * Created by hasee on 2017-10-17.
 */
var chatnormalUI = ccui.Widget.extend({
    ctor:function(text,cl) {
        this._super();

        var l = ccs.load("res/chatnormal.json");
        this.Widget = l.node;
        this.addChild(this.Widget);


        this.setContentSize(this.Widget.getContentSize());
        this.setTouchEnabled(false);
        this.setAnchorPoint(0, 0);

        var t = ccui.helper.seekWidgetByName(this.Widget, "ft_text");
        t.setString(text);
        t.setTextColor(cl);
        return true;
    },
    onEnter:function() {
        this._super();
    },
    onExit:function() {
        this._super();
    }
});