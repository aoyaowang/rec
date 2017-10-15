/**
 * Created by hasee on 2017-10-12.
 */
var Server = {
    Name:"Server",
    TIMEOUT: 10,
    send:function(id, msg) {
        if (!g_protocol[id])  {
            Xlog("protocol not exit:" + ID);
            return;
        }

        var url = g_server + g_protocol[id];
        this.basesend(url, msg, id);
    },
    basesend:function(url, vMap, id) {
        var xhr = cc.loader.getXMLHttpRequest();
        var params = "?";
        for(var key in vMap)
        {
            params="{0}{1}={2}&".Format(params,key,vMap[key]);
        }
        url=encodeURI("{0}{1}".Format(url,params));

        Nlog("Server:" + url);
        xhr.open("GET", url, true);
        var _this = this;
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState == 4 )
            {
                if(_this._timeOut)
                {
                    clearTimeout(_this._timeOut);
                    _this._timeOut = null;
                }
                if(xhr.status >= 200 && xhr.status <= 207)
                {
                    cc.log("xhr.responseText:{0}".Format(xhr.responseText));
                    Client.onMsg(id, JSON.parse(xhr.responseText), vMap);
                }
                else{
                    Client.onMsg(id, {code: -99}, vMap);
                }
            }
        }
        xhr.send();
        this._timeOut = setTimeout(function()
        {
            xhr.abort();
            Client.onMsg(id, {code: 500}, vMap);
        },this.TIMEOUT * 1000,this);
    }
};