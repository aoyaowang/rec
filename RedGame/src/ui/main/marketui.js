/**
 * Created by hasee on 2017-10-15.
 */
var marketUI = cc.Layer.extend({
    ctor:function() {
        this._super();

        var l = ccs.load("res/market.json");
        this.Widget = l.node;
        this.addChild(this.Widget);


        this.setContentSize(this.Widget.getContentSize());
        this.setAnchorPoint(0, 0);
        return true;
    },
    onEnter:function() {
        this._super();
    },
    onExit:function() {
        this._super();
    }
});