// mysql CRUD
var sqlclient = function()
{



	this._pool = null;
	var self = this;

	var NND = {};

	/*
	 * Init sql connection pool
	 * @param {Object} app The app for the server.
	 */
	NND.init = function(app,opt,id){
		self._pool = require('./dao-pool').createMysqlPool(app,opt,id);
	};

	/**
	 * Excute sql statement
	 * @param {String} sql Statement The sql need to excute.
	 * @param {Object} args The args for the sql.
	 * @param {fuction} cb Callback function.
	 *
	 */
	NND.query = function(sql, args, cb){
		self._pool.acquire(function(err, client) {
			if (!!err) {
				console.error('[sqlqueryErr] '+err.stack);
				return;
			}
			client.query(sql, args, function(err, res) {
				if (!!err) {
					console.error("SQL:" + sql + ":" + JSON.stringify(args) + "\n" + JSON.stringify(err));
				}
				self._pool.release(client);
				cb(err, res);
			});
		});
	};

	/**
	 * Close connection pool.
	 */
	NND.shutdown = function(){
		self._pool.destroyAllNow();
	};
	this.NND = NND;


}
module.exports = sqlclient;


var pro = sqlclient.prototype;


/**
 * init database
 */
pro.init = function(app,opt,id) {
	if (!this._pool){

		var NND = this.NND;
		NND.init(app,opt,id);
		this.insert = NND.query;
		this.update = NND.query;
		this.delete = NND.query;
		this.query = NND.query;
	}

	return this;
};

/**
 * shutdown database
 */
pro.shutdown = function(app) {
	this.NND.shutdown(app);
};






