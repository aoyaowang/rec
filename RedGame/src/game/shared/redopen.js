/**
 * Created by hasee on 2017-10-17.
 */
var redopenUI = cc.Layer.extend({
    ctor:function() {
        this._super();

        var l = ccs.load("res/redopen.json");
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