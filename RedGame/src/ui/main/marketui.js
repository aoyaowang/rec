/**
 * Created by hasee on 2017-10-15.
 */
var marketUI = cc.Layer.extend({
    ctor:function() {
        this._super();

        var l = ccs.load("res/market.json");
        this.Widget = l.node;
        this.addChild(this.Widget);

        var btn = ccui.helper.seekWidgetByName(this.Widget, "btn_gold6"); // 1FANGKA
        btn.addClickEventListener(this.goldClick.bind(this));
        btn.setTag(1);
        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_gold7"); // 1FANGKA
        btn.addClickEventListener(this.goldClick.bind(this));
        btn.setTag(50);
        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_gold8"); // 1FANGKA
        btn.addClickEventListener(this.goldClick.bind(this));
        btn.setTag(100);
        
        this.setContentSize(this.Widget.getContentSize());
        this.setAnchorPoint(0, 0);
        return true;
    },
    onEnter:function() {
        this._super();
    },
    onExit:function() {
        this._super();
    },
    goldClick:function(sender) {
        var m = sender.getTag();

    }
});