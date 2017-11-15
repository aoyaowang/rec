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
        this.setTouchEnabled(false);
        this.setAnchorPoint(0, 0);
        return true;
    },
    onEnter:function() {
        this._super();
        Client.addMap("billfangka", this);
    },
    onExit:function() {
        this._super();
        Client.removeMap("billfangka", this);
    },
    goldClick:function(sender) {
        var m = sender.getTag();
        if (parseInt(m) <= 0) return;
        Server.send("billfangka", {t: RoleInfo.token, bill: m});
    },
    billfangka:function(msg){
        if (msg.code != 0) return;
        var data = msg.data;
        if (isWeiXin()) {
            var timestamp = Date.parse(new Date()) / 1000;
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', data,
                function(res){
                    if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                        console.log("支付成功")
                    }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                }
            );
        }
    }
});