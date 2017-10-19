/**
 * Created by hasee on 2017-10-19.
 */
var redsubUI = ccui.Widget.extend({
    m_img_head: null,
    ctor:function(uid, img, name, time, money, qiang,colq, pei, colp, piao, colp2, total, colt) {
        this._super();

        var l = ccs.load("res/redsub.json");
        this.Widget = l.node;
        this.addChild(this.Widget);

        this.setAnchorPoint(0, 0);
        this.setContentSize(this.Widget.getContentSize());

        this.m_img_head = ccui.helper.seekWidgetByName(this.Widget, "img_head");
        headMgr.loadHead(uid, img, function(data){
            var size = data.getContentSize();
            this.m_img_head.setTexture(data);
            this.m_img_head.setTextureRect(cc.rect(0,0,size.width, size.height));
            var msize = this.m_img_head.getContentSize();
            this.m_img_head.setScale(Math.min(64/msize.width,64/msize.height) );
        }.bind(this));
        var btn = ccui.helper.seekWidgetByName(this.Widget, "ft_nickname");
        btn.setString(name);
        btn = ccui.helper.seekWidgetByName(this.Widget, "ft_time");
        var newDate = new Date();
        newDate.setTime(time * 1000);
        btn.setString(newDate.format("h:m:s"));

        btn = ccui.helper.seekWidgetByName(this.Widget, "ft_xxx");
        if (money) btn.setVisible(true);
        else btn.setVisible(false);

        if (qiang) {
            btn = ccui.helper.seekWidgetByName(this.Widget, "ft_qiang");
            btn.setString(qiang);
            btn.setColor(colq);
            btn.setVisible(true);
        }

        if (pei) {
            btn = ccui.helper.seekWidgetByName(this.Widget, "ft_pei");
            btn.setString(pei);
            btn.setColor(colp);
            btn.setVisible(true);
        }

        if (piao) {
            btn = ccui.helper.seekWidgetByName(this.Widget, "ft_menpiao");
            btn.setString(piao);
            btn.setColor(colp2);
            btn.setVisible(true);
        }

        if (total) {
            btn = ccui.helper.seekWidgetByName(this.Widget, "ft_total");
            btn.setString(total);
            btn.setColor(colt);
            btn.setVisible(true);
        }
        return true;
    },
    onEnter:function() {
        this._super();
    },
    onExit:function() {
        this._super();
    }
});