/**
 * Created by root on 12/1/15.
 */
module.exports.afterStartup = function(app, cb) {
    cb();

    console.log('game Init');
    app.rpc.business.gameRemote.Init(null, function(err, res){

    });
};