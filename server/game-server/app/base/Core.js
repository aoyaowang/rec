/**
 * Created by root on 5/3/16.
 */
Core = {};



(function()
{
    var fnTest = /\b_super\b/;
    var cc = cc;
    if(cc && cc.Class)
    {
        Core.baseClass = cc.Class;
    }
    else
    {
        Core.ClassManager = {};

        Core.clone = function (obj) {

            var newObj = (obj.constructor) ? new obj.constructor : {};

            for (var key in obj) {
                var copy = obj[key];
                // Beware that typeof null == "object" !
                if (((typeof copy) === "object") && copy  && !(copy instanceof HTMLElement)) {
                    newObj[key] = Core.clone(copy);
                } else {
                    newObj[key] = copy;
                }
            }
            return newObj;
        };

        var id = 1;
        instanceid = 1;
        Core.expand = function(root, name) {
            var results = [], parts, part;
            if (/^\.\.?(\/|$)/.test(name)) {
                parts = [root, name].join('/').split('/');
            } else {
                parts = name.split('/');
            }
            for (var i = 0, length = parts.length; i < length; i++) {
                part = parts[i];
                if (part == '..') {
                    results.pop();
                } else if (part != '.' && part != '') {
                    results.push(part);
                }
            }
            return results.join('/');
        }
        Core.forceRequire = function (file,fileTye)
        {
            file = '/' + Core.expand('',file) + (fileTye || ".json");

            if(require.cache[file]  )
            {
                delete require.cache[file]
            }

            return require(file);
        }
        Core.NewClassId = function()
        {
            return id++;
        }
        Core.NewInstanceId = function()
        {
            return instanceid++;
        }

        Core.compileSuper = function(func, name, id){
            //make the func to a string
            var str = func.toString();
            //find parameters
            var pstart = str.indexOf('('), pend = str.indexOf(')');
            var params = str.substring(pstart+1, pend);
            params = params.trim();

            //find function body
            var bstart = str.indexOf('{'), bend = str.lastIndexOf('}');
            var str = str.substring(bstart+1, bend);

            //now we have the content of the function, replace this._super
            //find this._super
            while(str.indexOf('this._super') !== -1)
            {
                var sp = str.indexOf('this._super');
                //find the first '(' from this._super)
                var bp = str.indexOf('(', sp);

                //find if we are passing params to super
                var bbp = str.indexOf(')', bp);
                var superParams = str.substring(bp+1, bbp);
                superParams = superParams.trim();
                var coma = superParams? ',':'';

                //replace this._super
                str = str.substring(0, sp)+  'Core.ClassManager['+id+'].'+name+'.call(this'+coma+str.substring(bp+1);
            }
            return Function(params, str);
        }



        Core.baseClass = function () {
        };
        Core.baseClass.extend = function (props) {
            var _super = this.prototype;

            // Instantiate a base Class (but only create the instance,
            // don't run the init constructor)
            var prototype = Object.create(_super);

            var classId = Core.NewClassId();
            Core.ClassManager[classId] = _super;
            // Copy the properties over onto the new prototype. We make function
            // properties non-eumerable as this makes typeof === 'function' check
            // unneccessary in the for...in loop used 1) for generating Class()
            // 2) for cc.clone and perhaps more. It is also required to make
            // these function properties cacheable in Carakan.
            var desc = { writable: true, enumerable: false, configurable: true };

            prototype.__instanceId = null;

            // The dummy Class constructor
            function Class() {
                this.__instanceId = Core.NewInstanceId();
                // All construction is actually done in the init method
                if (this.ctor)
                    this.ctor.apply(this, arguments);
            }

            Class.id = classId;
            // desc = { writable: true, enumerable: false, configurable: true,
            //          value: XXX }; Again, we make this non-enumerable.
            desc.value = classId;
            Object.defineProperty(prototype, '__pid', desc);

            // Populate our constructed prototype object
            Class.prototype = prototype;

            // Enforce the constructor to be what we expect
            desc.value = Class;
            Object.defineProperty(Class.prototype, 'constructor', desc);

            // Copy getter/setter
            this.__getters__ && (Class.__getters__ = Core.clone(this.__getters__));
            this.__setters__ && (Class.__setters__ = Core.clone(this.__setters__));

            for(var idx = 0, li = arguments.length; idx < li; ++idx) {
                var prop = arguments[idx];
                for (var name in prop) {
                    var isFunc = (typeof prop[name] === "function");
                    var override = (typeof _super[name] === "function");
                    var hasSuperCall = fnTest.test(prop[name]);

                    if ( isFunc && override && hasSuperCall) {
                        desc.value = Core.compileSuper(prop[name], name, classId);
                        Object.defineProperty(prototype, name, desc);
                    } else if (isFunc && override && hasSuperCall) {
                        desc.value = (function (name, fn) {
                            return function () {
                                var tmp = this._super;

                                // Add a new ._super() method that is the same method
                                // but on the super-Class
                                this._super = _super[name];

                                // The method only need to be bound temporarily, so we
                                // remove it when we're done executing
                                var ret = fn.apply(this, arguments);
                                this._super = tmp;

                                return ret;
                            };
                        })(name, prop[name]);
                        Object.defineProperty(prototype, name, desc);
                    } else if (isFunc) {
                        desc.value = prop[name];
                        Object.defineProperty(prototype, name, desc);
                    } else {
                        var pobj = prop[name];
                        if(pobj instanceof Object && (pobj.set || pobj.get))
                        {

                            if(pobj.get )
                            {
                                prototype.__defineGetter__(name, pobj.get)
                            }
                            if(pobj.set )
                            {
                                prototype.__defineSetter__(name, pobj.set )
                            }

                            var defaultValue = pobj.value || 0;
                            if(pobj.key)
                            {
                                prototype[pobj.key] = defaultValue;
                            }
                            else if(defaultValue){
                                prototype["__"+name] =defaultValue;
                            }

                        }
                        else
                        {
                            prototype[name] = pobj;
                        }
                        //prototype[name] = prop[name];
                    }

                    if (isFunc) {
                        // Override registered getter/setter
                        var getter, setter, propertyName;
                        if (this.__getters__ && this.__getters__[name]) {
                            propertyName = this.__getters__[name];
                            for (var i in this.__setters__) {
                                if (this.__setters__[i] === propertyName) {
                                    setter = i;
                                    break;
                                }
                            }
                            cc.defineGetterSetter(prototype, propertyName, prop[name], prop[setter] ? prop[setter] : prototype[setter], name, setter);
                        }
                        if (this.__setters__ && this.__setters__[name]) {
                            propertyName = this.__setters__[name];
                            for (var i in this.__getters__) {
                                if (this.__getters__[i] === propertyName) {
                                    getter = i;
                                    break;
                                }
                            }
                            cc.defineGetterSetter(prototype, propertyName, prop[getter] ? prop[getter] : prototype[getter], prop[name], getter, name);
                        }
                    }
                }
            }

            // And make this Class extendable
            Class.extend = Core.baseClass.extend;

            //add implementation method
            Class.implement = function (prop) {
                for (var name in prop) {
                    prototype[name] = prop[name];
                }
            };

            Class.Static = function(funs)
            {
                for(var fname in funs)
                {
                    var f = funs[fname];
                    //    if(f instanceof Object && (f.set || f.get))
                    //    {
                    //
                    //        if(f.get )
                    //        {
                    //            Class.__defineGetter__(name, f.get)
                    //        }
                    //        if(f.set )
                    //        {
                    //            Class.__defineSetter__(name, f.set )
                    //        }
                    //
                    //        var defaultValue = f.value || 0;
                    //        if(f.key)
                    //        {
                    //            Class[f.key] = defaultValue;
                    //        }
                    //        else if(defaultValue){
                    //            Class["__"+name] =defaultValue;
                    //        }
                    //    }
                    //    else
                    Class[fname] = f;
                }
                return Class;
            }
            return Class;
        };


    }

    Core.baseClass = Core.baseClass.extend({
        Dispose:function()
        {
            for(var key in this)
            {
                delete this[key];
            }
        }
    })
    Core.Instance = function()
    {
        if(!this._instance)
        {
            this._instance = new this;
        }
        return this._instance;
    }
    Core.mapArryHelper = {
        arrayInsert:function(skeys,list,value,from,to)
        {
            var idx = this.binarySearchIndex(skeys,list,value,from,to);
            list.splice(idx,0,value);
            return idx;
        },
        binarySearchIndex:function(skeys,list,temp,iBegin,iEnd)
        {
            var middle = -1;

            while (iBegin <= iEnd)
            {
                middle = parseInt((iBegin + iEnd) / 2);
                /// < middle
                if (this.compare(skeys,list[middle],temp) >0)
                {
                    iEnd = middle - 1;
                }
                else
                {
                    //
                    iBegin = middle + 1;
                }
            }

            return iBegin;
        },
        compare:function(skeys,n,t)
        {
            for(var i=0;i<skeys.length;i++ )
            {
                var temp = skeys[i],key = temp[0],cv = temp[1],c = t[key] == n[key];
                if(!c)
                    return (t[key]>n[key]) == cv ?1 : -1;
            }
            return -1;
        },
        CType:{
            UPDATE:0,
            ADD:1,
            DEL:2
        }

    }
    Core.mapArry =  Core.baseClass.extend({

        ctor:function(key,skeys)
        {
            var maps = {};
            var ay = [];
            var self = this;
            var nkeys = [];
            for(var i=0;i<skeys.length;i++)
            {
                var tempsort = skeys[i];
                for(var skey in tempsort)
                {
                    nkeys.push([skey,tempsort[skey]])
                    break;
                }
            }
            Object.defineProperty(self, "Map", {
                get: function () { return maps}
            });
            Object.defineProperty(self, "Ay", {
                get: function () { return ay}
            });
            Object.defineProperty(self, "m_pKey", {
                value:key,
                configurable:true,
                writable:false

            });
            Object.defineProperty(self, "m_pSortKeys", {
                value:nkeys,
                configurable:true,
                writable:false
            });

        },
        InsertOrModify:function(value)
        {
            var map = this.Map;
            var key = value[this.m_pKey];
            if(map.hasOwnProperty(key))
            {
                this.RemoveValue(key,true);
                this.InsertValue(value,true)
                this.afterModify(key,map[key].Index,value);
            }
            else
            {
                this.InsertValue(value);
            }
        },
        ModifyValue:function(value)
        {
            var map = this.Map;
            var key = value[this.m_pKey];
            if(map.hasOwnProperty(key))
            {
                this.RemoveValue(key,true);
                this.InsertValue(value,true);
                this.afterModify(key,map[key].Index,value);
            }
            else
            {
                console.error("value not find by key:"+key)
            }
        },
        InsertValue:function(value,skip)
        {
            var map = this.Map;
            var ay = this.Ay;
            var idx = 0;
            if(ay.length == 0)
            {
                ay.push(value);
            }
            else
            {
                idx = Core.mapArryHelper.arrayInsert(this.m_pSortKeys,ay,value,0,ay.length-1);
                for(var i=idx+1;i<ay.length;i++)
                {
                    var ctemp = map[ay[i][this.m_pKey]];
                    ctemp.Index++;
                }
            }
            var key = value[this.m_pKey];
            map[key] = {
                Index:idx,
                Value:value
            };

            if(!skip)
            {
                this.afterAdd(key,idx,value);
            }
        },
        RemoveValue:function(key,skip)
        {
            var map = this.Map;
            var ay = this.Ay;


            var temp = map[key];
            var idx = i = temp.Index;
            ay.splice(i,1);
            delete  map[key];
            for(; i<ay.length; i++ )
            {
                var ctemp = map[ay[i][this.m_pKey]];
                ctemp.Index--;
            }

            if(!skip)
            {
                this.afertDel(key,idx,temp);
            }
        },
        afterAdd:function(key,idx,value)
        {
            console.log("afterAdd");
        },
        afterModify:function(key,idx,value)
        {
            console.log("afterModify");
        },
        afertDel:function(key,idx,value)
        {
            console.log("afertDel");
        }
    })
    Core.obserData = Core.baseClass.extend({
        m_pNotifyMap:null,
        m_pNotifying:false,
        ctor:function()
        {
            this.m_pNotifying = false;
            this.m_pNotifyMap = [];
            this.m_pRemoveNotifys = [];

        },


        clearRemoveNotifys:function()
        {
            for(var i=this.m_pRemoveNotifys.length-1;i>-1;i--)
            {
                this.m_pNotifyMap.splice(this.m_pRemoveNotifys[i],1);
            }
        },
        Notify:function(value,c)
        {
            this.m_pNotifying = true;
            for(var i=0;i<this.m_pNotifyMap.length;i++)
            {
                var temp = this.m_pNotifyMap[i];
                temp[1].apply(temp[0],arguments);
            }
            this.m_pNotifying = false;

            this.clearRemoveNotifys();

        },
        AddNotify:function(t,cb)
        {
            for(var i=0;i<this.m_pNotifyMap.length;i++)
            {
                var temp = this.m_pNotifyMap[i];
                if(temp[0] == t && temp[1] == cb)
                {
                    console.error("this notify have added...");
                    return;
                }
            }
            this.m_pNotifyMap.push([t,cb])
        },
        RemoveNotify:function(t,cb)
        {

            for(var i=0;i<this.m_pNotifyMap.length;i++)
            {
                var temp = this.m_pNotifyMap[i];
                if(temp[0] == t && temp[1] == cb)
                {
                    this.m_pRemoveNotifys.push(i);
                }
            }

            if(!this.m_pNotifying)
            {
                this.clearRemoveNotifys();
            }

        },
        clearNotify:function()
        {
            this.m_pNotifyMap = [];
            this.m_pRemoveNotifys = [];
        }
    })

    //// key-value
    Core.obserValueData = Core.obserData.extend({

        ctor:function(keys)
        {
            this._super();
            var value = {};
            var self = this;
            keys.forEach(function(key)
            {
                value[key] = 0;

                Object.defineProperty(self, key, {
                    get: function () { return value[key] }
                });
            })

            Object.defineProperty(self, "Value", {
                get: function () { return value}
            });

            Object.defineProperty(self, "Change", {
                set: function (v) {
                    var notify = false;
                    for(var key in v)
                    {
                        if(value[key] != v[key])
                        {
                            value[key] = v[key]
                            notify = true;
                        }
                    }
                    if(notify)
                    {
                        this.Notify(value,v);
                    }

                }
            });

        }
    })

    Core.obserMapAyData =  Core.obserData.extend({
        ctor:function(key,skeys)
        {
            var value = new Core.mapArry(key,skeys);
            Object.defineProperty(this, "Value", {
                get: function () { return value}
            });
        }
    })

    Core.MSGClass =Core.baseClass.extend({
        ctor:function()
        {
            /*
             *   { key : []}
             * */
            var msglist = {};
            function addmap(key,t,f)
            {

                var list = msglist[key] ;
                if(list)
                {
                    list.push([t,f]);
                }
                else
                {
                    msglist[key] = [[t,f]];
                }

            }
            function removemap(key ,t,f)
            {
                var list = msglist[key] ;
                if(list)
                {
                    for(var i=0;i<list.length;i++)
                    {
                        var temp = list[i];
                        if(temp[0] == t && temp[1] == f)
                        {
                            list.splice(i,1);
                            break;
                        }
                    }
                }
                else
                {
                    console.error("not find in maplist by key:"+key);
                }
            }

            function notify(key,msg,req,cres)
            {
                var list = msglist[key];
                if(list)
                {
                    console.log(key)
                    for(var i=0;i<list.length;i++)
                    {
                        var temp = list[i];
                        temp[1].call(temp[0],msg,req,cres) ;
                    }
                }

            }

            function clear()
            {
                msglist = {};
            }
            this.addmap = addmap;
            this.removemap = removemap;
            this.notify = notify;
            this.clear = clear;

        }

    })
    Core.MSG = {
        msgs:{

        }
        //get Mgr ()
        //{
        //    if(!this._mgrInstance)
        //    {
        //        this._mgrInstance = new Core.MSGClass()
        //    }
        //    return this._mgrInstance;
        //}
    }


})()



typeof require !== 'undefined' && require("fs") && (module.exports = Core);