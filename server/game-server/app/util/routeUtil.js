var route = module.exports;

//route.area = function(session, msg, app, cb) {
//	var serverId = session.get('serverId');
//
//	if(!serverId) {
//		cb(new Error('can not find server info for type: ' + msg.serverType));
//		return;
//	}
//
//	cb(null, serverId);
//};
//
route.connector = function(session, msg, app, cb) {
	if(!session) {
		cb(new Error('fail to route to connector server for session is empty'));
		return;
	}

	if(!session.frontendId) {
		cb(new Error('fail to find frontend id in session'));
		return;
	}

	cb(null, session.frontendId);
};

route.barserver = function(session, msg, app, cb)
{
	if(!session) {
		cb(new Error('fail to route to connector server for session is empty'));
		return;
	}

	var bid = session.settings.bid;
	console.log("bid is:"+bid);
	if(!session.bid) {
		cb(new Error('fail to find frontend id in session'));
		return;
	}

	cb(null, bid);
}
