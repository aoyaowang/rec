/**
 * Created by hasee on 2017-10-29.
 */
var logUI = ccui.Widget.extend({
    ctor:function(r, g, time, c, m) {
        this._super();

        var l = ccs.load("res/sublog.json");
        this.Widget = l.node;
        this.addChild(this.Widget);


        this.setContentSize(this.Widget.getContentSize());
        this.setTouchEnabled(false);
        this.setAnchorPoint(0, 0);

        var t = ccui.helper.seekWidgetByName(this.Widget, "ft_roomid");
        t.setString(r);
        t = ccui.helper.seekWidgetByName(this.Widget, "ft_game");
        t.setString(g);
        t = ccui.helper.seekWidgetByName(this.Widget, "ft_time");
        t.setString(time);
        t = ccui.helper.seekWidgetByName(this.Widget, "ft_coin");
        t.setString(c);
        t = ccui.helper.seekWidgetByName(this.Widget, "ft_money");
        t.setString(m);
        return true;
    },
    onEnter:function() {
        this._super();
    },
    onExit:function() {
        this._super();
    }
});