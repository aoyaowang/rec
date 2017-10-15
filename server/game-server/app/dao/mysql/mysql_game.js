// mysql CRUD
var sqlclient2 = module.exports;

var _pool;

var NND2 = {};

/*
 * Init sql connection pool
 * @param {Object} app The app for the server.
 */
NND2.init = function(app){
	_pool = require('./dao-pool-game').createMysqlPool(app);
};

/**
 * Excute sql statement
 * @param {String} sql Statement The sql need to excute.
 * @param {Object} args The args for the sql.
 * @param {fuction} cb Callback function.
 * 
 */
NND2.query = function(sql, args, cb){
	_pool.acquire(function(err, client) {
		if (!!err) {
			console.error('[sqlqueryErr] '+err.stack);
			return;
		}
		client.query(sql, args, function(err, res) {
			if (!!err) {
				console.error(JSON.stringify(err));
			}
			_pool.release(client);
			cb(err, res);
		});
	});
};

/**
 * Close connection pool.
 */
NND2.shutdown = function(){
	_pool.destroyAllNow();
};

/**
 * init database
 */
sqlclient2.init = function(app) {
	if (!!_pool){
		return sqlclient2;
	} else {
		NND2.init(app);
		sqlclient2.insert = NND2.query;
		sqlclient2.update = NND2.query;
		sqlclient2.delete = NND2.query;
		sqlclient2.query = NND2.query;
		return sqlclient2;
	}
};

/**
 * shutdown database
 */
sqlclient2.shutdown = function(app) {
	NND2.shutdown(app);
};






