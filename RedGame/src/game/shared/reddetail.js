/**
 * Created by hasee on 2017-10-17.
 */
var reddetailUI = ccui.Widget.extend({
    m_imghead: null,
    m_ft_name: null,
    m_ft_ext: null,
    m_ft_top: null,
    m_ft_money: null,

    m_listview: null,

    m_coin: null,
    m_num: null,
    m_data: null,
    m_red: null,
    ctor:function(data, red) {
        this._super();

        this.m_coin = red.coin;
        this.m_num = red.num;
        this.m_data = data;
        this.m_red = red;

        var l = ccs.load("res/redopen.json");
        this.Widget = l.node;
        this.addChild(this.Widget);


        this.setContentSize(this.Widget.getContentSize());
        this.setAnchorPoint(0, 0);

        var btn = ccui.helper.seekWidgetByName(this.Widget, "btn_close");
        btn.addClickEventListener(this.closeClick.bind(this));

        this.m_imghead = ccui.helper.seekWidgetByName(this.Widget, "img_head");
        this.m_ft_name = ccui.helper.seekWidgetByName(this.Widget, "ft_title");
        this.m_ft_ext = ccui.helper.seekWidgetByName(this.Widget, "ft_ext");
        this.m_ft_top = ccui.helper.seekWidgetByName(this.Widget, "ft_top");
        this.m_ft_money = ccui.helper.seekWidgetByName(this.Widget, "ft_money");
        this.m_listview = ccui.helper.seekWidgetByName(this.Widget, "ListView_1");

        headMgr.loadHead(red.owner.uid, red.owner.headimg, function(data){
            var size = data.getContentSize();
            this.m_imghead.setTexture(data);
            this.m_imghead.setTextureRect(cc.rect(0,0,size.width, size.height));
            var msize = this.m_imghead.getContentSize();
            this.m_imghead.setScale(Math.min(150/msize.width,150/msize.height) );
        }.bind(this));

        this.m_ft_name.setString(this.m_red.owner.gamename == "" ? this.m_red.owner.nickname:this.m_red.owner.gamename+
        "的红包");
        if (this.m_type == 1)
            this.m_ft_ext.setString(red.coin + "金额/雷" + red.bomb + "/" + (num == 7 ? "1.5" : "1.0") + "倍");
        else this.m_ft_ext.setVisible(false);

        var bfind = false;
        for (var key in data) {
            if (data[key].data.uid == RoleInfo.uid) {
                if (!!data[key].data.qiang)
                    this.m_ft_money.setString(parseInt(data[key].data.qiang) / 100);
                else {
                    this.m_ft_money.setString(parseInt(data[key].m) / 100);
                }
                bfind = true;
                break;
            }
        }

        if (!bfind) this.m_ft_money.setVisible(false);

        var ct = 0; for (var k in data) ct++;
        var m = 0; for (var k in data) {
            if (!!data[k].data.qiang)
            {
                m += parseInt(data[k].data.qiang);
                continue;
            }
            if (isNaN(parseInt(data[k].m))) {
                m = 'xxx'
                break;
            } else {
                m += parseInt(data[k].m);
            }
        }
        if (!isNaN(parseInt(m))) m = parseInt(m) / 100;
        this.m_ft_top.setString("已经领取" + ct + "/" + num + "个,共" + (m / 100) + "/" + (coin / 100) + "王者币");

        this.initList();
        return true;
    },
    initList:function() {
        for (var key in this.m_data) {
            var p = this.m_data[key];
            if (p.m)
                var ui = new redsubUI(p.data.uid, p.data.headimg, p.data.gamename == "" ? p.data.nickname : p.data.gamename, p.time, p.m);
            else {
                var qiang = (this.m_red.owner.uid == p.data.uid ? "⭐庄" : this.m_red.bomb == p.data.last ? "⭐炸弹" : "")
                    + (p.data.qiang / 100);
                var ql = cc.Color(0,255,0);
                var pei = "赔付:" + (this.m_red.bomb == p.data.last ? "-" + (parseInt(this.m_coin) * 1.5) / 100 : 0);
                var pl = this.m_red.bomb == p.data.last ? cc.Color(255, 0, 0) : cc.Color(0,255,0);
                var mp = Math.floor(parseInt(p.data.qiang) * 0.03 / 100);
                if (mp < 0.01) mp = 0;
                else mp = "-" + mp;
                var piao = "门票:" + mp;
                var pl = mp > 0 ? cc.Color(255, 0, 0) : cc.Color(0,255,0);
                var ttt = "总计" + p.data.result;
                var tl = p.data.result < 0 ? cc.Color(255, 0, 0) : cc.Color(0,255,0);
                var ui = new redsubUI(p.data.uid, p.data.headimg, p.data.gamename == "" ? p.data.nickname : p.data.gamename, p.time, null, qiang, ql, pei, pl, piao, pl, ttt, tl);
            }

            this.m_listview.pushBackCustomItem(ui);
        }
    },
    onEnter:function() {
        this._super();
    },
    onExit:function() {
        this._super();
    },
    closeClick:function() {
        this.removeFromParent();
    }
});