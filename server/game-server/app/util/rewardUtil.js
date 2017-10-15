/**
 * Created by root on 3/24/16.
 */


var enums = require('../consts/enums');


var rewardUtil = module.exports;


/*
* {
*   slg:{k:[],v:[]},
*   zone:{k:[],v:[]},
*   chat:{k:[],v:[]}
*
* }
*
* */
rewardUtil.rewCfg = function()
{
    return {
        slg:{k:[],v:[]},
        zone:{k:[],v:[]},
        chat:{k:[],v:[]}
    }
}
/*
*
* 申请方
 类型（对应不同表）,id,数量;
 类型

 1=家具（furniture）
 2=衣服（clothes）
 3=道具（item）
 4=礼物（present）
 5=金币
 6=钻石
 7=宝石
 8=矿石
 9=兵种（battle_warrior）
 10=vip等级
* */
rewardUtil.typeKeys = {
    1:["slg",enums.DB.FITMENT],
    3:["slg",enums.DB.BAG],
    8:["slg",enums.DB.PLAYER],
    9:["slg",""],


    4:["chat",""],
    5:["chat",enums.DB.PLAYER],
    6:["chat",enums.DB.PLAYER],
    7:["chat",enums.DB.PLAYER],
    10:["chat",enums.DB.PLAYER],

    2:["zone",enums.DB.CLOTH]
}

rewardUtil.Analysis= function(reward,sp)
{
    sp = sp?sp:";";
    var rs = reward.split(sp);
    var resault = this.rewCfg();
    for(var i=0;i<rs.length;i++)
    {
        if(rs[i].length>0)
            this.AnalysisOne(rs[i],resault);
    }
    return resault;
}
rewardUtil.AnalysisOne = function(item,info)
{
    var iteminfo = item.split("_");
    if(3 == iteminfo.length || 4 == iteminfo.length)
    {
        var type = iteminfo[0];
        
        var keys = this.typeKeys[type];
        var gkey = keys[0];
        var dbkey = keys[1];

        var hdkey = false;
        var hdkeys = info[gkey].k;
        for(var i=0;i<hdkeys.length;i++)
        {
            if(hdkeys[i] == dbkey)
            {
                hdkey = true;
                break;
            }
        }
        if(!hdkey)
        {
            hdkeys.push(dbkey);
        }
        info[gkey].v.push(iteminfo);
    }
    else
    {
        console.warn("not find item by info:"+item);
    }
}

rewardUtil.AnalysisTask= function(reward,sp)
{
    sp = sp?sp:";";
    var rs = reward.split(sp);
    var resault = this.rewCfg();
    for(var i=0;i<rs.length;i++)
    {
        if(rs[i].length>0)
            this.AnalysisTaskOne(rs[i],resault);
    }
    return resault;
}
rewardUtil.AnalysisTaskOne = function(item,info)
{
    var iteminfo = item.split(",");
    if(3 == iteminfo.length || 4 == iteminfo.length)
    {
        var type = iteminfo[0];

        var keys = this.typeKeys[type];
        var gkey = keys[0];
        var dbkey = keys[1];

        var hdkey = false;
        var hdkeys = info[gkey].k;
        for(var i=0;i<hdkeys.length;i++)
        {
            if(hdkeys[i] == dbkey)
            {
                hdkey = true;
                break;
            }
        }
        if(!hdkey)
        {
            hdkeys.push(dbkey);
        }
        info[gkey].v.push(iteminfo);
    }
    else
    {
        console.warn("not find item by info:"+item);
    }
}

rewardUtil.AnalysisSlg = function(uid,reward,self,next)
{
    var change = {};
    var cInfo = {
        uid: uid,
        Change: change
    };
    reward = reward["slg"];

    var dbkeys = enums.DB;
    var needInfos = reward.k;
    var items = reward.v;
    self.app.rpc.database.databaseRemote.getPartInfo(null,uid,needInfos,function(err,data)
    {
        if(err)
        {
            next({e:-1});
            return;
        }
        var allCfg = self.app.get('configdata').getAllCfg();
        var cfgkeys = enums.CFG;
        var fitCfg = allCfg[cfgkeys.FITMENT];
        var itemCfg = allCfg[cfgkeys.ITEM];
        for(var i=0;i<items.length;i++)
        {
            var temp = items[i];
            var type = temp[0];
            var id = temp[1];
            var num = temp[2];
            if(type == 1)
            {
                var infos = change[dbkeys.FITMENT] || [];
                var list = data[dbkeys.FITMENT];
                infos.push(rewardUtil.newFit(uid,fitCfg[id],list));
                change[dbkeys.FITMENT] = infos;
            }
            else if(type == 3)
            {
                var infos = change[dbkeys.BAG] || [];
                var list = data[dbkeys.BAG];
                infos.push(rewardUtil.newBag(uid,itemCfg[id],list));
                change[dbkeys.BAG] = infos;
            }
            else if(type == 8)
            {
                change[dbkeys.PLAYER] = {
                    userid:uid,
                    ore:num
                };
            }
            else if(type == 9)
            {

            }
        }

        next(null,cInfo);
    })

}
rewardUtil.AnalysisZone = function(uid,reward,self,next)
{
    var change = {};
    var cInfo = {
        uid: uid,
        Change: change
    };

    var dbkeys = enums.DB;
    var needInfos = reward.k;
    var items = reward.v;
    needInfos.push(dbkeys.PLAYER);
    self.app.rpc.database.databaseRemote.getPartInfo(null,uid,needInfos,function(err,data)
    {

        if(err)
        {
            next({e:-1});
            return;
        }
        var allCfg = self.app.get('configdata').getAllCfg();
        var cfgkeys = enums.CFG;
        var clothCfg = allCfg[cfgkeys.CLOTH];
        var sex = data[dbkeys.PLAYER].sex;
        for(var i=0;i<items.length;i++)
        {
            var temp = items[i];
            var type = temp[0];
            var id = temp[1];
            var num = temp[2];
            if(type == 2)
            {
                var manid = temp[1];
                var wmid = temp[2];
                num = temp[3];

                id = sex == 1? manid:wmid;
                var infos = change[dbkeys.CLOTH] || [];
                var list = data[dbkeys.CLOTH];
                var ncloth = rewardUtil.newCloth(uid,clothCfg[id],list,num);
                if(ncloth)
                {
                    infos.push(ncloth);
                    change[dbkeys.CLOTH] = infos;
                }
            }
        }

        next(null,cInfo);
    })
}
rewardUtil.AnalysisChat = function(uid,reward,self,next)
{
    var change = {};
    var cInfo = {
        uid: uid,
        Change: change
    };
    reward = reward["chat"];

    var dbkeys = enums.DB;
    var needInfos = reward.k;
    var items = reward.v;
    self.app.rpc.database.databaseRemote.getPartInfo(null,uid,needInfos,function(err,data)
    {
        if(err)
        {
            next({e:-1});
            return;
        }
       var player = data[dbkeys.PLAYER];
        change[dbkeys.PLAYER]={
            userid:uid
        }

        for(var i=0;i<items.length;i++)
        {
            var temp = items[i];
            var type = temp[0];
            var id = temp[1];
            var num = temp[2];
            if(type == 5)
            {
                change[dbkeys.PLAYER].gold = num;
            }
            else if(type == 6)
            {
                change[dbkeys.PLAYER].diamond = num;
            }
            else if(type == 7)
            {
                change[dbkeys.PLAYER].sliver = num;
            }
            else if(type == 10)
            {

            }
        }

        next(null,cInfo);
    })
}

rewardUtil.newFit = function(uid,itemcfg,baglist)
{
    var aFit = {
        rowid: -1,
        userid: uid,
        id: itemcfg.id,
        place: '-1',
        roomid: -1,
        direction: 1,
        time: 0
    };

    var fit = null;
    for(var i in baglist)
    {
        if(baglist[i].id == itemcfg.id)
        {
            fit = baglist[i];
            break;
        }

    }
    var timestamp = Date.parse(new Date()) / 1000;
    if (fit) {
        if (fit.time > timestamp) {
            aFit.time = fit.time + itemcfg.time * 24 * 60 * 60;
        } else {
            aFit.time = timestamp + itemcfg.time * 24 * 60 * 60;
        }

        aFit.rowid = fit.rowid;
        aFit.place = fit.place;
        aFit.roomid = fit.roomid;
        aFit.direction = fit.direction;
    } else {
        aFit.time = timestamp + itemcfg.time * 24 * 60 * 60;
    }

    return aFit;

}

rewardUtil.newBag = function(itemid,num,baglist)
{
    var item = null;
    var rowid = -1;
    for(var rowid in baglist)
    {
        if(baglist[rowid].itemid == itemid)
        {
            item = baglist[rowid];
            rowid = item.rowid;
            break;
        }
    }
    if(item)
    {

        item = {
            rowid:rowid,
            stack:num

        }
    }
    else
    {
        item = {
            rowid:-1,
            stack:num,
            itemid:itemid
        }
    }
    return item;
}


rewardUtil.newCloth = function(uid,itemcfg,baglist,day)
{
    if (!itemcfg){
        return null;
    }

    var off = false;
    var begin = null;

    var cid = itemcfg.id;
    if(baglist.hasOwnProperty(cid))
    {
        off = true;
        if (baglist[cid].endtime === 0){

            return null;
        }
        begin = baglist[cid].begintime;
    }
    else
    {
        begin =  Date.parse(new Date()) / 1000;
    }



    return {
        user: uid,
        id: itemcfg.id,
        use: 0,
        begintime:begin,
        endtime: begin + day * 24 * 3600
    };
}