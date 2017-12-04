/**
 * Created by hasee on 2017-10-17.
 */
var redopenUI = ccui.Widget.extend({
    m_imghead: null,
    m_ft_name: null,
    m_ft_ext: null,
    m_ft_top: null,
    m_ft_money: null,

    m_listview: null,

    m_id: null,
    m_money: null,
    m_coin: null,
    m_num: null,
    m_data: null,
    m_red: null,
    m_type: null,

    m_zqiang:null,
    m_zpei:null,
    m_zpiao:null,
    m_ztotal:null,
    ctor:function(type,id, money, coin, num, data, red) {
        this._super();

        num = num || 4;
        var oldcoin = coin;
        if (red.halltype + 1 == 4) coin = 400;
        if (red.halltype + 1 == 3) coin = 100;
        this.m_id = id;
        this.m_money = money;
        this.m_coin = coin;
        this.m_num = num;
        this.m_data = data;
        this.m_red = red;
        this.m_type = red.halltype + 1;


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

        this.m_zqiang = ccui.helper.seekWidgetByName(this.Widget, "ft_zqiang");
        this.m_zpei = ccui.helper.seekWidgetByName(this.Widget, "ft_zpei");
        this.m_zpiao = ccui.helper.seekWidgetByName(this.Widget, "ft_zpiao");
        this.m_ztotal = ccui.helper.seekWidgetByName(this.Widget, "ft_ztotal");
        this.m_zqiang.setVisible(false);
        this.m_zpei.setVisible(false);
        this.m_zpiao.setVisible(false);
        this.m_ztotal.setVisible(false);

        headMgr.loadHead(red.owner.uid, red.owner.headimg, function(data){
            if (!data) return;
            var size = data.getContentSize();
            this.m_imghead.setTexture(data);
            this.m_imghead.setTextureRect(cc.rect(0,0,size.width, size.height));
            var msize = this.m_imghead.getContentSize();
            this.m_imghead.setScale(Math.min(150/msize.width,150/msize.height) );
        }.bind(this));

        this.m_ft_name.setString(this.m_red.owner.gamename == "" ? this.m_red.owner.nickname:this.m_red.owner.gamename+
                                    "的红包");

        if (this.m_type == 1)
            this.m_ft_ext.setString(red.coin + "币/雷" + red.bomb + "/" + (num == 7 ? "1.5" : "1.0") + "倍");
        else if (this.m_type == 4) {
            this.m_ft_ext.setString("王者二八杠" + (oldcoin / 100) + "币包/赔率一倍")
        }
        else {
            this.m_ft_ext.setVisible(false);
        }

        this.m_ft_money.setString(isNaN(parseInt(money)) ? money : money / 100);
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
        this.m_ft_top.setString("已经领取" + ct + "/" + num + "个,共" + m + "/" + (coin / 100) + "王者币");

        this.initList();
        return true;
    },
    initList:function() {
        var minp = null;
        var min = 9999999999999999999999;
        var maxp = null;
        var max = 0;
        for (var key in this.m_data) {
            var p = this.m_data[key];
            if (p.m) continue;

            if (min > p.data.qiang) {
                minp = p;
                min = p.data.qiang;
            }
            if (max < p.data.qiang) {
                maxp = p;
                max = p.data.qiang;
            }
        }

        var zset = true;
        var zqiang = 0;
        var zpei = -1 *parseInt(this.m_coin) / 100;

        for (var key in this.m_data) {
            var p = this.m_data[key];
            if (p.m)
                var ui = new redsubUI(p.data.uid, p.data.headimg, p.data.gamename == "" ? p.data.nickname : p.data.gamename, p.time, p.m);
            else {
                if (this.m_type == 1) {
                    var qiang = (this.m_red.owner.uid == p.data.uid ? "⭐庄" : this.m_red.bomb == p.data.last ? "⭐炸弹" : "")
                        + ("抢包:");
                    var qiang0 = (p.data.qiang / 100);
                    if (this.m_red.owner.uid == p.data.uid) {
                        zqiang = p.data.qiang;
                    }
                    var ql = cc.color(0,255,0);
                    var pei = "赔付:";
                    var pei0 = (this.m_red.bomb == p.data.last && this.m_red.owner.uid == p.data.uid ? "-" + (parseInt((parseInt(this.m_coin) * 1.5)) / 100) : 0);
                    var pel = pei0 != 0 ? cc.color(255, 0, 0) : cc.color(0,255,0);
                    if (this.m_red.bomb == p.data.last && this.m_red.owner.uid == p.data.uid) {
                        zpei += (parseInt(this.m_coin * (this.m_num == 7 ? 1.5:1.0)) / 100);
                    }
                    var mp = parseInt(parseInt(p.data.qiang) * 0.03) / 100;
                    if (mp < 0.01) mp = 0;
                    else mp = -1* mp;
                    var piao = "门票:";
                    var piao0 = mp;
                    var pl = mp != 0 ? cc.color(255, 0, 0) : cc.color(0,255,0);
                    var ttt = "总计:";
                    var ttt0 = p.data.result;
                    var tl = p.data.result < 0 ? cc.color(255, 0, 0) : cc.color(0,255,0);
                    var ui = new redsubUI(p.data.uid, p.data.headimg, p.data.gamename == "" ? p.data.nickname : p.data.gamename, p.data.time, null,
                        qiang, ql, pei, pel, piao, pl, ttt, tl, qiang0, pei0, piao0, ttt0);
                    if (this.m_red.owner.uid == p.data.uid) {
                        this.m_zqiang.setString(qiang0);
                        this.m_zqiang.setColor(ql);
                        this.m_zqiang.setVisible(true);

                        this.m_zpei.setString(pei0);
                        this.m_zpei.setColor(pel);
                        this.m_zpei.setVisible(true);

                        this.m_zpiao.setString(piao0);
                        this.m_zpiao.setColor(pl);
                        this.m_zpiao.setVisible(true);

                        this.m_ztotal.setString(ttt0);
                        this.m_ztotal.setColor(tl);
                        this.m_ztotal.setVisible(true);
                        zset = false;
                    }
                }
                else if (this.m_type == 2) {
                    var qiang = (p == minp ? " 最小" : this.m_red.bomb == p.data.last ? "⭐最差" : "")
                        +("抢包:");
                    var qiang0 = (p.data.qiang / 100);
                    var ql = cc.color(0,255,0);
                    var pei = "赔付:";
                    var pei0 = (p == minp ? "-" + (parseInt((parseInt(this.m_coin) * 1.0)) / 100) : 0);
                    var pel = pei0 != 0 ? cc.color(255, 0, 0) : cc.color(0,255,0);
                    var mp = parseInt(parseInt(p.data.qiang) * 0.03) / 100;
                    if (mp < 0.01) mp = 0;
                    else mp = "-" + mp;
                    var piao = "门票:";
                    var piao0 = mp;
                    var pl = mp != 0 ? cc.color(255, 0, 0) : cc.color(0,255,0);
                    var ttt = "总计:";
                    var ttt0 = p.data.result;
                    var tl = p.data.result < 0 ? cc.color(255, 0, 0) : cc.color(0,255,0);
                    var ui = new redsubUI(p.data.uid, p.data.headimg, p.data.gamename == "" ? p.data.nickname : p.data.gamename, p.data.time, null,
                        qiang, ql, pei, pel, piao, pl, ttt, tl, qiang0, pei0, piao0, ttt0);
                }
                else if (this.m_type == 3 || this.m_type == 4) {
                    var qiang = (this.m_red.owner.uid == p.data.uid ? "⭐庄" : "")
                        + ("抢包:");
                    var qiang0 = (p.data.qiang / 100);
                    var ql = cc.color(0,255,0);
                    var pei = "赔付:";
                    var pei0 = (p.data.pei < 0 ? (parseInt((parseInt(p.data.pei) * 1.0)) / 100) : (parseInt((parseInt(p.data.pei) * 1.0)) / 100));
                    var pel = p.data.pei < 0 ? cc.color(255, 0, 0) : cc.color(0,255,0);
                    var mp = parseInt(p.data.piao) / 100;
                    if (mp < 0.01) mp = 0;
                    else mp = "-" + mp;
                    var piao = "门票:";
                    var piao0 = mp;
                    var pl = mp != 0 ? cc.color(255, 0, 0) : cc.color(0,255,0);
                    var ttt = "总计:";
                    var ttt0 = p.data.result
                    var tl = p.data.result < 0 ? cc.color(255, 0, 0) : cc.color(0,255,0);
                    var ui = new redsubUI(p.data.uid, p.data.headimg, p.data.gamename == "" ? p.data.nickname : p.data.gamename, p.data.time, null,
                        qiang, ql, pei, pel, piao, pl, ttt, tl, qiang0, pei0, piao0, ttt0);
                }
            }

            if (this.m_type == 1) {
                if (zset) {
                    this.m_zqiang.setString(zqiang);
                    this.m_zqiang.setColor(cc.color(0, 255, 0));
                    this.m_zqiang.setVisible(true);

                    this.m_zpei.setString(zpei);
                    this.m_zpei.setColor(cc.color(0, 255, 0));
                    this.m_zpei.setVisible(true);

                    var all = zpei + zqiang;
                    var zzpiao = parseInt(all * 0.03) / 100;
                    this.m_zpiao.setString(zzpiao);
                    var zpl = zzpiao != 0 ? cc.color(255, 0, 0) : cc.color(0, 255, 0);
                    this.m_zpiao.setColor(zpl);
                    this.m_zpiao.setVisible(true);

                    var ztt = parseInt((zpei + zqiang) / 100) - zzpiao;
                    var ztl = ztt < 0 ? cc.color(255, 0, 0) : cc.color(0,255,0);

                    this.m_ztotal.setString(ztt);
                    this.m_ztotal.setColor(ztl);
                    this.m_ztotal.setVisible(true);
                } else if (this.m_zpiao.isVisible()) {

                    var zpel = zpei < 0 ? cc.color(255, 0, 0) : cc.color(0,255,0);
                    this.m_zpei.setString(zpei);
                    this.m_zpei.setColor(zpel);

                    var all = zpei + zqiang;
                    var zzpiao = parseInt(all * 0.03) / 100;
                    this.m_zpiao.setString(zzpiao);
                    var zpl = zzpiao != 0 ? cc.color(255, 0, 0) : cc.color(0, 255, 0);
                    this.m_zpiao.setColor(zpl);
                }
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