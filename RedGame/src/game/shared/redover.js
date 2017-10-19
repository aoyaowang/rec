/**
 * Created by hasee on 2017-10-17.
 */
var redoverUI = cc.Layer.extend({
    ctor:function() {
        this._super();

        var l = ccs.load("res/redover.json");
        this.Widget = l.node;
        this.addChild(this.Widget);
        return true;
    },
    onEnter:function() {
        this._super();
    },
    onExit:function() {
        this._super();
    }
});