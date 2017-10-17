/**
 * Created by hasee on 2017-10-17.
 */
var __headMgr = cc.Class.extend({
    m_map:null,
    ctor:function() {
        this.m_map = {};
    },
    loadHead:function(uid, url, cb) {
        if (!!this.m_map[uid] && this.m_map[uid].url == url) {
            cb(this.m_map[uid].head);
            return;
        }
        if (!this.m_map[uid]) this.m_map[uid] = {};
        this.m_map[uid].url = url;
        cc.loader.loadImg(url, {isCrossOrigin : false}, function(err, texture){
            var texture2d = new cc.Texture2D();
            texture2d.initWithElement(texture);
            texture2d.handleLoadedTexture();
            this.m_map[uid].head = texture2d;
            cb(texture2d);
        }.bind(this));
    }
});

var headMgr = new __headMgr();