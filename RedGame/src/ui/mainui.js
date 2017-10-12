/**
 * Created by hasee on 2017-10-12.
 */

var mainUI = cc.Layer.extend({
    ctor:function() {
        this._super();

        var l = ccs.load("res/main.json");
        this.Widget = l.node;
        this.addChild(this.Widget);

        return true;
    }
});