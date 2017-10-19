/**
 * Created by hasee on 2017-10-15.
 */
var hallUI = cc.Layer.extend({

    m_game_1:null,
    m_game_2:null,
    m_game_3:null,
    m_game_4:null,
    ctor:function() {
        this._super();

        var l = ccs.load("res/game.json");
        this.Widget = l.node;
        this.addChild(this.Widget);


        this.setContentSize(this.Widget.getContentSize());
        this.setAnchorPoint(0, 0);

        var btn = ccui.helper.seekWidgetByName(this.Widget, "btn_game1");
        btn.addClickEventListener(this.gameClick.bind(this));
        this.m_game_1 = btn;
        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_game2");
        btn.addClickEventListener(this.gameClick.bind(this));
        this.m_game_2 = btn;
        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_game3");
        btn.addClickEventListener(this.gameClick.bind(this));
        this.m_game_3 = btn;
        btn = ccui.helper.seekWidgetByName(this.Widget, "btn_game4");
        btn.addClickEventListener(this.gameClick.bind(this));
        this.m_game_4 = btn;

        return true;
    },
    onEnter:function() {
        this._super();
    },
    onExit:function() {
        this._super();
    },
    gameClick:function(sender) {
        var type = 1;
        if (sender == this.m_game_1) type = 1;
        else if (sender == this.m_game_2) type = 2;
        else if (sender == this.m_game_3) type = 3;
        else if (sender == this.m_game_4) type = 4;

        var ui = new roomsUI(type);
        this.Widget.addChild(ui);
    }
});