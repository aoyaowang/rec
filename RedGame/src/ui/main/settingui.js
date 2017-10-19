/**
 * Created by hasee on 2017-10-15.
 */
var settingUI = ccui.Widget.extend({
    m_ft_name:null,
    m_img_head:null,
    m_ft_fangka:null,
    m_ft_id:null,
    ctor:function() {
        this._super();

        var l = ccs.load("res/setting.json");
        this.Widget = l.node;
        this.addChild(this.Widget);

        this.setContentSize(this.Widget.getContentSize());

        this.m_ft_name = ccui.helper.seekWidgetByName(this.Widget, "ft_name");
        this.m_img_head = ccui.helper.seekWidgetByName(this.Widget, "img_head");
        this.m_ft_fangka = ccui.helper.seekWidgetByName(this.Widget, "ft_fangka");
        this.m_ft_id = ccui.helper.seekWidgetByName(this.Widget, "ft_id");

        return true;
    },
    onEnter:function() {
        this._super();
        RoleInfo.addOb(this.RoleInfoChange, this);
    },
    onExit:function() {
        this._super();
        RoleInfo.removeOb(this.RoleInfoChange, this);
    },
    RoleInfoChange:function(role) {
        if (RoleInfo.img) {
            var size = RoleInfo.img.getContentSize();
            this.m_img_head.setTexture(RoleInfo.img);
            this.m_img_head.setTextureRect(cc.rect(0,0,size.width, size.height));
            var msize = this.m_img_head.getContentSize();
            this.m_img_head.setScale(Math.min(150/msize.width,150/msize.height) );
        }
        this.m_ft_name.setString(RoleInfo.gamename == "" ? RoleInfo.nickname : RoleInfo.gamename);
        this.m_ft_fangka.setString(RoleInfo.fangka);
        this.m_ft_id.setString(RoleInfo.uid);
    }
});