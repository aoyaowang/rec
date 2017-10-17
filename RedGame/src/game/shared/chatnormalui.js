/**
 * Created by hasee on 2017-10-17.
 */
var chatnormalUI = cc.Layer.extend({
    ctor:function(text) {
        this._super();

        var l = ccs.load("res/chatnormal.json");
        this.Widget = l.node;
        this.addChild(this.Widget);

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