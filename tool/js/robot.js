/*
* @Author: lowRin
* @Date:   2017-11-02 14:48:44
* @Last Modified by:   lowRin
* @Last Modified time: 2017-12-14 21:09:49
*/
layui.config({
    base: 'plugins/layui/modules/'
});

layui.use(['icheck', 'laypage','layer'], function() {
    var $ = layui.jquery,
        laypage = layui.laypage,
        layer = parent.layer === undefined ? layui.layer : parent.layer;
    $('input').iCheck({
        checkboxClass: 'icheckbox_flat-green'
    });

    function page1Jump(map, obj, first) {
    var curr = obj.curr - 1;
    var start = curr * 5;
    for (;start < map[0].length && start < start+5;++start) {
        var a = map[0][start];
        var trHTML = '<tr><td><input type="checkbox"></td>';
        var data = null;
        try{
            data = JSON.parse(a.param);
        } catch (e) {
            data = null;
        }
        trHTML += "<td>";
        trHTML += "扫雷";
        trHTML += "</td>";

        trHTML += "<td><ul>";
        if (a.time1 != "{}") {
            try {
                var t = JSON.parse(a.time1);
                trHTML += "<li>" + t.btime + "--"+ t.etime + "</li>";
            }catch(e){

            }
        }
        if (a.time2 != "{}") {
            try {
                var t = JSON.parse(a.time2);
                trHTML += "<li>" + t.btime + "--"+ t.etime + "</li>";
            }catch(e){

            }
        }
        if (a.time3 != "{}") {
            try {
                var t = JSON.parse(a.time3);
                trHTML += "<li>" + t.btime + "--"+ t.etime + "</li>";
            }catch(e){

            }
        }
        trHTML += "</ul></td>";

        trHTML += "<td><ul>";
        if (data && data.fa) {
            for (var x in data.fa) {
                var afa = data.fa[x];
                trHTML += "<li>币:" + afa.coin + " 包:" + afa.num + " 時:" + afa.time + afa.qiang ? "自己抢" : "不抢</li>";
            }
        } else {
            trHTML += "无";
        }
        trHTML += "</ul></td>";

        trHTML += "<td><ul>";
        if (data && data.qiang) {
            for (var x in data.qiang) {
                var aqiang = data.qiang[x];
                trHTML += "<li>币:" + aqiang.coin + " 抢:" + aqiang.q + " 停:" + aqiang.t + "</li>";
            }
        } else {
            trHTML += "无";
        }
        trHTML += "</ul></td>";

        trHTML += "<td>";
        if (data && data.buqiang) {
            trHTML += "补抢:" + data.buqiang;
        } else {
            trHTML += "无";
        }
        trHTML += "</td>";

        trHTML += "<td>";
        if (data && data.fagailv) {
            trHTML += "概率:" + data.fagailv + "%";
        } else {
            trHTML += "无";
        }
        trHTML += "</td>";

        trHTML += "<td>";
        if (data && data.qianggailv) {
            trHTML += "概率:" + data.qianggailv + "%";
        } else {
            trHTML += "无";
        }
        trHTML += "</td>";

        trHTML += "<td>";
        trHTML += '<a href="javascript:;" data-id="' + 0 + '|' + start + '" data-opt="del" class="layui-btn layui-btn-danger layui-btn-mini">删除</a>';
        trHTML += "</td>";

        trHTML += "</tr>";
        $('#tab1 tr:eq(0)').after(trHTML);
    }
}

function page2Jump(map, obj, first) {
    var curr = obj.curr - 1;
    var start = curr * 5;
    for (;start < map[1].length && start < start+5;++start) {
        var a = map[1][start];
        var trHTML = '<tr><td><input type="checkbox"></td>';
        var data = null;
        try{
            data = JSON.parse(a.param);
        } catch (e) {
            data = null;
        }
        trHTML += "<td>";
        trHTML += "扫雷";
        trHTML += "</td>";

        trHTML += "<td><ul>";
        if (a.time1 != "{}") {
            try {
                var t = JSON.parse(a.time1);
                trHTML += "<li>" + t.btime + "--"+ t.etime + "</li>";
            }catch(e){

            }
        }
        if (a.time2 != "{}") {
            try {
                var t = JSON.parse(a.time2);
                trHTML += "<li>" + t.btime + "--"+ t.etime + "</li>";
            }catch(e){

            }
        }
        if (a.time3 != "{}") {
            try {
                var t = JSON.parse(a.time3);
                trHTML += "<li>" + t.btime + "--"+ t.etime + "</li>";
            }catch(e){

            }
        }
        trHTML += "</ul></td>";

        trHTML += "<td><ul>";
        if (data && data.fa) {
            for (var x in data.fa) {
                var afa = data.fa[x];
                trHTML += "<li>币:" + afa.coin + " 時:" + afa.time;
            }
        } else {
            trHTML += "无";
        }
        trHTML += "</ul></td>";

        trHTML += "<td><ul>";
        if (data && data.qiang) {
            for (var x in data.qiang) {
                var aqiang = data.qiang[x];
                trHTML += "<li>币:" + aqiang.coin + " 抢:" + aqiang.q + " 停:" + aqiang.t + "</li>";
            }
        } else {
            trHTML += "无";
        }
        trHTML += "</ul></td>";

        trHTML += "<td>";
        if (data && data.buqiang) {
            trHTML += "补抢:" + data.buqiang;
        } else {
            trHTML += "无";
        }
        trHTML += "</td>";

        trHTML += "<td><ul>";
        if (data && data['1']) {
            trHTML += "<li>不抢最小:" + (data['1']['nomin'] ? "真" : "假") + " 抢最大:" + (data['1']['max'] ? "真" : "假") + "</li>";
        }
        if (data && data['2']) {
            trHTML += "<li>";
            for (var s in data['2']) {
                var n = data['2'][s];
                var tt = "";
                if (s == 'min') tt = "最小";
                else if (s == 'max') tt = "最大";
                else if (s == 'nomin') tt = "不抢最小";
                else if (s == 'nomax') tt = "不抢最大";
                else if (s == 'mid') tt = "中间";
                trHTML += s + ":" + n + " ";
            }
            trHTML += "</li>";
        }
        trHTML += "</ul></td>";

        trHTML += "<td>";
        trHTML += '<a href="javascript:;" data-id="' + 1 + '|' + start + '" data-opt="del" class="layui-btn layui-btn-danger layui-btn-mini">删除</a>';
        trHTML += "</td>";

        trHTML += "</tr>";
        $('#tab2 tr:eq(0)').after(trHTML);
    }
}

function page3Jump(map, obj, first) {
    var curr = obj.curr - 1;
    var start = curr * 5;
    for (;start < map[2].length && start < start+5;++start) {
        var a = map[2][start];
        var trHTML = '<tr><td><input type="checkbox"></td>';
        var data = null;
        try{
            data = JSON.parse(a.param);
        } catch (e) {
            data = null;
        }
        trHTML += "<td>";
        trHTML += "牛牛";
        trHTML += "</td>";

        trHTML += "<td><ul>";
        if (a.time1 != "{}") {
            try {
                var t = JSON.parse(a.time1);
                trHTML += "<li>" + t.btime + "--"+ t.etime + "</li>";
            }catch(e){

            }
        }
        if (a.time2 != "{}") {
            try {
                var t = JSON.parse(a.time2);
                trHTML += "<li>" + t.btime + "--"+ t.etime + "</li>";
            }catch(e){

            }
        }
        if (a.time3 != "{}") {
            try {
                var t = JSON.parse(a.time3);
                trHTML += "<li>" + t.btime + "--"+ t.etime + "</li>";
            }catch(e){

            }
        }
        trHTML += "</ul></td>";

        trHTML += "<td><ul>";
        if (data && data.fa) {
            for (var x in data.fa) {
                var afa = data.fa[x];
                trHTML += "<li>无包:" + afa.time + "秒 币:" + afa.coin + "</li>";
            }
        } else {
            trHTML += "无";
        }
        trHTML += "</ul></td>";

        trHTML += "<td><ul>";
        if (data && data.qiang) {
            for (var x in data.qiang) {
                var aqiang = data.qiang[x];
                trHTML += "<li>币:" + aqiang.coin + " 抢:" + aqiang.q + " 停:" + aqiang.t + "</li>";
            }
        } else {
            trHTML += "无";
        }
        trHTML += "</ul></td>";

        trHTML += "<td>";
        if (data && data.buqiang) {
            trHTML += "补抢:" + data.buqiang;
        } else {
            trHTML += "无";
        }
        trHTML += "</td>";

        trHTML += "<td>";
        if (data && data.xchiz) {
            trHTML += "总局:" + data.xchiz.total + " 吃庄:" + data.xchiz.win + " 赔庄:" + data.xchiz.lose;
        } else {
            trHTML += "无";
        }
        trHTML += "</td>";

        trHTML += "<td><ul>";
        if (data && data.zchix) {
            trHTML += "<li>总局:" + data.xchiz.total + " 通杀:" + data.xchiz.allwin + " 通赔:" + data.xchiz.alllose + " 正常:" + data.xchiz.normal + "</li>";
            for (var key in data.zchix.ct) {
                var xzz = data.zchix.ct[key];
                trHTML += "<li>赢"+xzz.ctwin+"家 输" + xzz.ctlose + "家 共" + xzz.t + "次</li>";
            }
        } else {
            trHTML += "无";
        }
        trHTML += "</ul></td>";

        trHTML += "<td>";
        trHTML += '<a href="javascript:;" data-id="' + 0 + '|' + start + '" data-opt="del" class="layui-btn layui-btn-danger layui-btn-mini">删除</a>';
        trHTML += "</td>";

        trHTML += "</tr>";
        $('#tab1 tr:eq(0)').after(trHTML);
    }
}

function page4Jump(map, obj, first) {
    var curr = obj.curr - 1;
    var start = curr * 5;
    for (;start < map[3].length && start < start+5;++start) {
        var a = map[3][start];
        var trHTML = '<tr><td><input type="checkbox"></td>';
        var data = null;
        try{
            data = JSON.parse(a.param);
        } catch (e) {
            data = null;
        }
        trHTML += "<td>";
        trHTML += "牛牛";
        trHTML += "</td>";

        trHTML += "<td><ul>";
        if (a.time1 != "{}") {
            try {
                var t = JSON.parse(a.time1);
                trHTML += "<li>" + t.btime + "--"+ t.etime + "</li>";
            }catch(e){

            }
        }
        if (a.time2 != "{}") {
            try {
                var t = JSON.parse(a.time2);
                trHTML += "<li>" + t.btime + "--"+ t.etime + "</li>";
            }catch(e){

            }
        }
        if (a.time3 != "{}") {
            try {
                var t = JSON.parse(a.time3);
                trHTML += "<li>" + t.btime + "--"+ t.etime + "</li>";
            }catch(e){

            }
        }
        trHTML += "</ul></td>";

        trHTML += "<td><ul>";
        if (data && data.fa) {
            for (var x in data.fa) {
                var afa = data.fa[x];
                trHTML += "<li>无包:" + afa.time + "秒 币:" + afa.coin + "</li>";
            }
        } else {
            trHTML += "无";
        }
        trHTML += "</ul></td>";

        trHTML += "<td><ul>";
        if (data && data.qiang) {
            for (var x in data.qiang) {
                var aqiang = data.qiang[x];
                trHTML += "<li>币:" + aqiang.coin + " 抢:" + aqiang.q + " 停:" + aqiang.t + "</li>";
            }
        } else {
            trHTML += "无";
        }
        trHTML += "</ul></td>";

        trHTML += "<td>";
        if (data && data.buqiang) {
            trHTML += "补抢:" + data.buqiang;
        } else {
            trHTML += "无";
        }
        trHTML += "</td>";

        trHTML += "<td>";
        if (data && data.xchiz) {
            trHTML += "总局:" + data.xchiz.total + " 吃庄:" + data.xchiz.win + " 赔庄:" + data.xchiz.lose;
        } else {
            trHTML += "无";
        }
        trHTML += "</td>";

        trHTML += "<td><ul>";
        if (data && data.zchix) {
            trHTML += "<li>总局:" + data.xchiz.total + " 通杀:" + data.xchiz.allwin + " 通赔:" + data.xchiz.alllose + " 正常:" + data.xchiz.normal + "</li>";
            for (var key in data.zchix.ct) {
                var xzz = data.zchix.ct[key];
                trHTML += "<li>赢"+xzz.ctwin+"家 输" + xzz.ctlose + "家 共" + xzz.t + "次</li>";
            }
        } else {
            trHTML += "无";
        }
        trHTML += "</ul></td>";

        trHTML += "<td>";
        trHTML += '<a href="javascript:;" data-id="' + 0 + '|' + start + '" data-opt="del" class="layui-btn layui-btn-danger layui-btn-mini">删除</a>';
        trHTML += "</td>";

        trHTML += "</tr>";
        $('#tab1 tr:eq(0)').after(trHTML);
    }
}

    httpget("getallrobot", function(err,data){
        if (!!err) {
            console.log("数据请求失败");
            //layer.tips('数据请求失败', this,{tips: [1, 'red']});
            return;
        }

        console.log(data);
        try{
            var retdata = JSON.parse(data);
        }catch(e) {
            console.log("数据解析失败");
            //layer.tips('数据解析失败', this,{tips: [1, 'red']});
            return;
        }

        if (retdata.code != 0) {
            console.log('数据请求返回错误 CODE:' + retdata.code);
            return;
        }

        var allrobot = 0; //全部机器人数量
        var leftrobot = 0; //剩余机器人数量

        var map = {0:[], 1:[], 2:[], 3:[]};
        var robots = {};

        data = retdata.config;
        var robotdata = retdata.data;
        for (var key in robotdata) {
            robots[robotdata[key].uid] = 1;
            allrobot++;
        }
        for (var i in data) {
            var a = data[i];
            if (!a) continue;
            var key = a.game + "|" + a.time1 + "|" + a.time2 + "|" + a.time3 + "|" + a.param;
            if (!map[a.game]) map[a.game] =[];
            //if (!map[a.game][key]) map[a.game][key] = [];
            map[a.game].push(a);
            leftrobot++;
            delete robots[a.uid];
        }
        leftrobot = allrobot - leftrobot;

        var ct = map[0].length;
        var pagect = ct / 5;
        //page
        laypage({
            cont: 'page1',
            pages: pagect //总页数
                ,
            groups: 5 //连续显示分页数
                ,
            jump: function(obj, first) {
                //得到了当前页，用于向服务端请求对应数据
                page1Jump(map, obj, first);
            }
        });

        ct = map[1].length;
        pagect = ct / 5;
        laypage({
            cont: 'page2',
            pages: pagect //总页数
                ,
            groups: 5 //连续显示分页数
                ,
            jump: function(obj, first) {
                //得到了当前页，用于向服务端请求对应数据
                page2Jump(map, obj, first);
            }
        });

        ct = map[2].length;
        pagect = ct / 5;
        laypage({
            cont: 'page3',
            pages: pagect //总页数
                ,
            groups: 5 //连续显示分页数
                ,
            jump: function(obj, first) {
                //得到了当前页，用于向服务端请求对应数据
                page3Jump(map, obj, first);
            }
        });

        ct = map[3].length;
        pagect = ct / 5;
        laypage({
            cont: 'page4',
            pages: pagect //总页数
                ,
            groups: 5 //连续显示分页数
                ,
            jump: function(obj, first) {
                //得到了当前页，用于向服务端请求对应数据
                page4Jump(map, obj, first);
            }
        });
        $('#add').on('click', function() {
            $.get('temp/addrobot.html', null, function(form) {
                var extdata = "<script>console.log('extdata');robots="+JSON.stringify(robots)+"</script>"
                layer.open({
                    type: 1,
                    title: '添加表单',
                    content: extdata+form,
                    btn: [],
                    area: ['600px', '400px'],
                    maxmin: true,
                    yes: function(index) {
                        console.log(index);
                    },
                    full: function(elem) {
                        var win = window.top === window.self ? window : parent.window;
                        $(win).on('resize', function() {
                            var $this = $(this);
                            elem.width($this.width()).height($this.height()).css({
                                top: 0,
                                left: 0
                            });
                            elem.children('div.layui-layer-content').height($this.height() - 95);
                        });
                    },
                    end: function () {
                        location.reload();
                    },
                    success: function(layero, index){

                    }
                });
            });
        });

        $('#addgame1').on('click', function() {
            $.get('temp/setgame1.html', null, function(form) {

                var extdata = "<script>console.log('extdata');robots="+JSON.stringify(robots)+"</script>"
                layer.open({
                    type: 1,
                    title: '添加扫雷机器人',
                    content: extdata+form,
                    btn: [],
                    area: ['600px', '400px'],
                    maxmin: true,
                    yes: function(index) {
                        console.log(index);
                    },
                    full: function(elem) {
                        var win = window.top === window.self ? window : parent.window;
                        $(win).on('resize', function() {
                            var $this = $(this);
                            elem.width($this.width()).height($this.height()).css({
                                top: 0,
                                left: 0
                            });
                            elem.children('div.layui-layer-content').height($this.height() - 95);
                        });
                    },
                    end: function () {
                        location.reload();
                    },
                    success: function(layero, index){

                    }
                });
            });
        });

        $('#addgame2').on('click', function() {
            $.get('temp/setgame2.html', null, function(form) {

                var extdata = "<script>console.log('extdata');robots="+JSON.stringify(robots)+"</script>"
                layer.open({
                    type: 1,
                    title: '添加接龙机器人',
                    content: extdata+form,
                    btn: [],
                    area: ['600px', '400px'],
                    maxmin: true,
                    yes: function(index) {
                        console.log(index);
                    },
                    full: function(elem) {
                        var win = window.top === window.self ? window : parent.window;
                        $(win).on('resize', function() {
                            var $this = $(this);
                            elem.width($this.width()).height($this.height()).css({
                                top: 0,
                                left: 0
                            });
                            elem.children('div.layui-layer-content').height($this.height() - 95);
                        });
                    },
                    end: function () {
                        location.reload();
                    },
                    success: function(layero, index){

                    }
                });
            });
        });
    }.bind(this));

    $('.site-table tbody tr').on('click', function(event) {
        var $this = $(this);
        var $input = $this.children('td').eq(0).find('input');
        $input.on('ifChecked', function(e) {
            $this.css('background-color', '#EEEEEE');
        });
        $input.on('ifUnchecked', function(e) {
            $this.removeAttr('style');
        });
        $input.iCheck('toggle');
    }).find('input').each(function() {
        var $this = $(this);
        $this.on('ifChecked', function(e) {
            $this.parents('tr').css('background-color', '#EEEEEE');
        });
        $this.on('ifUnchecked', function(e) {
            $this.parents('tr').removeAttr('style');
        });
    });
    $('#selected-all').on('ifChanged', function(event) {
        var $input = $('.site-table tbody tr td').find('input');
        $input.iCheck(event.currentTarget.checked ? 'check' : 'uncheck');
    });
});

layui.use('element', function() {
    var $ = layui.jquery,
        element = layui.element(); //Tab的切换功能，切换事件监听等，需要依赖element模块
});