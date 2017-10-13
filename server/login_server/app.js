var db = require('../utils/db');
var configs = require(process.argv[2]);

//init db pool.
db.init(configs.mysql());

var config = configs.login_server();
var ls = require('./login_server');
ls.start(config);
