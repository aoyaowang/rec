
var tickManager = function(){
    this.m_ayTick = {};  //注册到当前计时器的数组
    this.m_tickNumber = 0;  //tick个数计数，不断网上加
    this.m_ayDelTick = [];
    this.m_bLock = false;
    this.m_pCurrentTime = Date.parse(new Date()) / 1000;
    setInterval(this.checkUpdate.bind(this),1000);
};

tickManager.prototype.addTick = function(p_cb,p_target,p_tick,p_repeat,args){
    this.m_tickNumber ++;
    var cTick = {};
    cTick["cb"] = p_cb;
    cTick["target"] = p_target;
    cTick["tick"] = Math.max(1,parseInt(p_tick));
    cTick["now"] = 0;
    cTick["repeat"] = p_repeat || -1;
    cTick["args"] = args;
    this.m_ayTick[this.m_tickNumber] = cTick;

};



tickManager.prototype.removeTick = function(p_cb,p_target){
    if(this.m_bLock) {
        process.nextTick(this.removeTick.bind(this));
    }
    for(var i in this.m_ayTick){
        var tick = this.m_ayTick[i];
        if(tick["target"] == p_target && tick["cb"] == p_cb  ) {
            this.m_ayDelTick.push(i);
        }
    }

};

tickManager.prototype.checkUpdate = function()
{
    var current = Date.parse(new Date()) / 1000;
    var count = Math.floor(current - this.m_pCurrentTime);

    if(count>0)
    {
        for(var i=count;i>0;i--)
        {
            this.update();
        }
        this.m_pCurrentTime = current;
    }
};

tickManager.prototype.update = function(){
    this.m_bLock = true;
    for(var i = 0; i < this.m_ayDelTick.length;i++) {
        this.m_ayTick[this.m_ayDelTick[i]] = null;
        delete this.m_ayTick[this.m_ayDelTick[i]];
    }
    this.m_ayDelTick = [];

    for(var i in this.m_ayTick) {
        var tick = this.m_ayTick[i];
        tick["now"] += 1;

        if(tick["now"] == tick["tick"]){
            tick["now"] = 0;
            tick["cb"].call(tick["target"],tick["args"] );

            if(tick["repeat"] > 0){
                tick["repeat"] -= 1;
                if(tick["repeat"] == 0){
                    this.m_ayDelTick.push(i);
                }
            }
        }
    }
    this.m_bLock = false;
};

//module.exports = tickManager;

module.exports = function() {
    return new tickManager();
};