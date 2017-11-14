cc.loader.load(["res/loading.json"],
    function(){
        var self = this;
    console.log("aaaa!!");
        var scene = new cc.Scene();
        var loadingLayer = new loadingUI();
        scene.addChild(loadingLayer);
        cc.director.runScene(scene);
    console.log("bbbb!!");
        cc.loader.load(g_resources, function(result, total,idx){
                loadingLayer.setPercent(100*idx/total);
        },
        function(){
            if(loadingLayer.ResourceComplete)
            console.log("Over!!!!")
                loadingLayer.ResourceComplete();
        });
    });
