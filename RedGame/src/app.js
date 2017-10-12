cc.loader.load(["res/loading.json"],
    function(){
        var self = this;

        var scene = new cc.Scene();
        var loadingLayer = new loadingUI();
        scene.addChild(loadingLayer);
        cc.director.runScene(scene);

        cc.loader.load(g_resources, function(result, total,idx){
                loadingLayer.setPercent(100*idx/total);
        },
        function(){
            if(loadingLayer.ResourceComplete)
                loadingLayer.ResourceComplete();
        });
    });
