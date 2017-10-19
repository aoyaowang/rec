/**
 * Created by hasee on 2017-10-17.
 */
var chatredUI = ccui.Widget.extend({
    m_cb:null,
    ctor:function(img, nickname, text, cb) {
        this._super();

        this.m_cb = cb;

        var l = ccs.load("res/chatred.json");
        this.Widget = l.node;
        this.addChild(this.Widget);

        var btn = ccui.helper.seekWidgetByName(this.Widget, "img_head");
        if (!!img) {
            var size = img.getContentSize();
            btn.setTexture(img);
            btn.setTextureRect(cc.rect(0,0,size.width, size.height));
            var msize = btn.getContentSize();
            btn.setScale(Math.min(64/msize.width,64/msize.height) );
        }
        btn = ccui.helper.seekWidgetByName(this.Widget, "ft_nickname");
        btn.setString(nickname);
        btn = ccui.helper.seekWidgetByName(this.Widget, "ft_text");
        btn.setString(text);

        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_red");
        btn.addClickEventListener(this.btnClick.bind(this));
        return true;
    },
    btnClick:function() {
        this.m_cb(this);
    }
});