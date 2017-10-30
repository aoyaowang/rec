var logger = require('pomelo-logger').getLogger(__filename);
var pomelo = require('pomelo');
var async = require('async');

var Core = require("../base/Core");
var enums = require("../consts/enums");
var utils = require("../util/utils");

var GJLAI = Core.obserData.extend({
    ctor:function()
    {
        GBaseAI.prototype.ctor.apply(this,arguments);
    },
    factoryData:function() {
        return {};
    },
    Dispose:function()
    {
        this._super();
    },
    onTimer:function(room) {

    }
}).Static({
    Instance:Core.Instance
});
module.exports = GJLAI;