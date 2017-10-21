/**
 * Created by hasee on 2017-10-12.
 */
var DEBUG_MODE = 1;

var Nlog = function() {
    if (DEBUG_MODE) {
        console.log.apply(console.log, arguments);
    }
}

var Xlog = function() {
    console.log.apply(console.log, arguments);
};

ccui.Text.prototype.setStringAuto = function(str) {
    return function() {
        this.setString(str);
    }

}(ccui.Text.prototype.setStringAuto);


(function() {
    function a(a, c, e, f) {
        var g;
        return g = function() {
            c ? a.apply(c, e) : a.apply(null, e);
            f && clearTimeout(g)
        }
    }
    function c(b) {
        return function(c, e, f, g) {
            c = a(c, f, g);
            return b(c, e)
        }
    }
    String.Parse = function(a) {
        if (void 0 === a || null === a) return "(" + String(a) + ")";
        if (a.constructor === String || a.constructor === Number) return a;
        if (a instanceof Function) return (a = Library.ClassManager.GetClassByClass(a)) ? "[" + a.toString() + "]": "[Function]";
        if (a instanceof Array) try {
            return JSON.stringify(a)
        } catch(c) {
            Class.Assert(!1, c)
        }
        try {
            return JSON.stringify(a)
        } catch(e) {
            Class.Assert(!1, e)
        }
        return "(error)"
    };
    String.prototype.Format = function() {
        var a = arguments;
        if (1 === a.length) {
            var c = a[0];
            if (c instanceof Array) a = c;
            else if (c.constructor === Object) {
                var e = /{([^{}]+)}/gm;
                return this.replace(e,
                    function(a, b) {
                        return c.hasOwnProperty(b) ? String.Parse(c[b]) : a
                    })
            }
        }
        e = /{(\d+)}/gm;
        return this.replace(e,
            function(c, d) {
                return~~d < a.length ? String.Parse(a[~~d]) : c
            })
    };
    if (! (Object.defineProperty instanceof Function)) if (Object.prototype.__defineGetter__ instanceof Function && Object.prototype.__defineSetter__ instanceof Function) Object.defineProperty = function(a, c, e) {
        var f, g = e.writable ? e.set: function(a) {
            throw "property can not be wrote.";
        };
        e.hasOwnProperty("value") ? (f = function() {
            return e.value
        },
        e.writable && (g = function(a) {
            e.value = a
        })) : f = e.get ? e.get: function() {
            throw "property can not be read";
        };
        e.get instanceof Function && a.__defineGetter__(c, f);
        e.writable && e.set instanceof Function && a.__defineSetter__(c, g)
    };
    else throw "system not support defineProperty";
    cc.Node.prototype.autorelease = function() {};
    cc.log = function(a) {
        return function() {
            0 === arguments.length && a("JSLOG:undefine");
            for (var c = arguments,
                     e = "",
                     f = 0; f < c.length; f++) e += String.Parse(c[f]);
            a("JSLOG:" + e)
        }
    } (cc.log);

    //Object.defineProperty(System, "IsNativeApp", {
    //    value: !1,
    //    writable: !1,
    //    configurable: !1,
    //    enumerable: !0
    //});

    cc.Node.prototype.cleanup = function(a) {
        return function() {
            if (this.onCleanup) this.onCleanup();
            a.apply(this, arguments)
        }
    } (cc.Node.prototype.cleanup);
    setTimeout = c(setTimeout);
    setInterval = c(setInterval)

    Date.prototype.format = function(format) {
        var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    }
})();