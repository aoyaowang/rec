var utils = module.exports;

// control variable of func "myPrint"
var isPrintFlag = false;

/**
 * Check and invoke callback function
 */
utils.invokeCallback = function(cb) {
  if(!!cb && typeof cb === 'function') {
    cb.apply(null, Array.prototype.slice.call(arguments, 1));
  }
};

/**
 * clone an object
 */
utils.clone = function(origin) {
  if(!origin) {
    return;
  }

  var obj = {};
  for(var f in origin) {
    if(origin.hasOwnProperty(f)) {
      obj[f] = origin[f];
    }
  }
  return obj;
};

utils.size = function(obj) {
  if(!obj) {
    return 0;
  }

  var size = 0;
  for(var f in obj) {
    if(obj.hasOwnProperty(f)) {
      size++;
    }
  }

  return size;
};

// print the file name and the line number ~ begin
function getStack(){
  var orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function(_, stack) {
    return stack;
  };
  var err = new Error();
  Error.captureStackTrace(err, arguments.callee);
  var stack = err.stack;
  Error.prepareStackTrace = orig;
  return stack;
}

function getFileName(stack) {
  return stack[1].getFileName();
}

function getLineNumber(stack){
  return stack[1].getLineNumber();
}

utils.myPrint = function() {
  if (isPrintFlag) {
    var len = arguments.length;
    if(len <= 0) {
      return;
    }
    var stack = getStack();
    var aimStr = '\'' + getFileName(stack) + '\' @' + getLineNumber(stack) + ' :\n';
    for(var i = 0; i < len; ++i) {
      aimStr += arguments[i] + ' ';
    }
    console.log('\n' + aimStr);
  }
};

utils.getDBNum = function(uid){
  var db = uid.split('_')[0];
  if (!db){
    console.log("db get err : " + uid);
    return '1';
  }
  return db;
};

utils.TrimNull = function(str) {
  return str.replace(/(\s*$)/g,"");
};

var getRandomMoney = function(packet) {
    if (packet.packNumber == 0) {
        return;
    }
    if (packet.packNumber == 1) {
        var _lastMoney = Math.round(packet.money);
        packet.packNumber--;
        packet.money = 0;
        return _lastMoney;
    }
    var min = 1
      , 
    max = packet.money / packet.packNumber * 2
      , 
    money = Math.random() * max;
    money = money < min ? min : money;
    money = Math.floor(money);
    packet.packNumber--;
    packet.money = Math.round((packet.money - money));
    return money;
}

utils.getPackets = function(money, num, must) {
  var ary = [];
  var times = 0;
  var bFind = false;
  while(!bFind) {
    ary = [];
    var packet = {packNumber: num, money: money};
    for (var i = 0;i < num;++i) {
      var ret = getRandomMoney(packet);
      if (ret % 10 == must || must === null || must === undefined) bFind = true;
      ary.push(ret);
    }
    times++;
    if (times > 500) {
      console.error("CanNot Find RedPacket:" + must);
      break;
    }
  }

  return ary;
}

utils.GetRandomNum = function(Min,Max)
{   
  var Range = Max - Min;   
  var Rand = Math.random();   
  return(Min + Math.round(Rand * Range));   
}   