/**
 * Created by hasee on 2017-10-16.
 */
var roomitemUI = ccui.Widget.extend({
    m_name_1:null,
    m_num_1:null,
    m_name_2:null,
    m_num_2:null,
    m_name_3:null,
    m_num_3:null,
    ctor:function(info) {
        this._super();

        var l = ccs.load("res/roomitem.json");
        this.Widget = l.node;
        this.addChild(this.Widget);

        this.setAnchorPoint(0, 0);
        this.setContentSize(this.Widget.getContentSize());

        if (!info) return true;
        var btn = ccui.helper.seekWidgetByName(this.Widget, "btn_1");
        if (info[0]) {
            var tx = ccui.helper.seekWidgetByName(this.Widget, "ft_1");
            tx.setString(info[0].name);
            this.m_name_1 = tx;
            tx = ccui.helper.seekWidgetByName(this.Widget, "ft_num_1");
            tx.setString(info[0].num);
            this.m_num_1 = tx;
            btn.addClickEventListener(info[0].cb.bind(info[0].target));
            btn.setTag(info[0].tag);
        }
        else btn.setVisible(false);
        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_2");
        if (info[1]) {
            var tx = ccui.helper.seekWidgetByName(this.Widget, "ft_2");
            tx.setString(info[1].name);
            this.m_name_2 = tx;
            tx = ccui.helper.seekWidgetByName(this.Widget, "ft_num_2");
            tx.setString(info[1].num);
            this.m_num_2 = tx;
            btn.addClickEventListener(info[1].cb.bind(info[1].target));
            btn.setTag(info[1].tag);
        }
        else btn.setVisible(false);
        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_3");
        if (info[2]) {
            var tx = ccui.helper.seekWidgetByName(this.Widget, "ft_3");
            tx.setString(info[2].name);
            this.m_name_3 = tx;
            tx = ccui.helper.seekWidgetByName(this.Widget, "ft_num_3");
            tx.setString(info[2].num);
            this.m_num_3 = tx;
            btn.addClickEventListener(info[2].cb.bind(info[2].target));
            btn.setTag(info[2].tag);
        }
        else btn.setVisible(false);
        return true;
    },
    onEnter:function() {
        this._super();
    },
    onExit:function() {
        this._super();
    }
});