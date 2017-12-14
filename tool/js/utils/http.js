/*
* @Author: lowRin
* @Date:   2017-11-02 14:10:35
* @Last Modified by:   lowRin
* @Last Modified time: 2017-11-20 12:20:43
*/
var server = "http://test.obyjd.com:9800/"

window.httpget = function ( url, callback ){
    var time = 15000;
    var request = new XMLHttpRequest();
    var timeout = false;
    var timer = setTimeout( function(){
        timeout = true;
        request.abort();
    }, time );
    request.open( "GET", server +　url );
    request.onreadystatechange = function(){
        if( request.readyState !== 4 ){
            return;
        }
        if( timeout ) {
            callback(true, "" );
            return;
        }

        clearTimeout( timer );
        if( request.status === 200 ){
            callback(null, request.responseText );
        }
    }
    request.send( null );
};

window.httpgetdata = function ( url, map, callback ){
    var time = 15000;
    var request = new XMLHttpRequest();
    var timeout = false;
    var timer = setTimeout( function(){
        timeout = true;
        request.abort();
    }, time );
    for (var key in map) {
        url += key + "=" + encodeURI(map[key]) + "&";
    }
    request.open( "GET", server +　url );
    request.onreadystatechange = function(){
        if( request.readyState !== 4 ){
            return;
        }
        if( timeout ) {
            callback(true, "" );
            return;
        }

        clearTimeout( timer );
        if( request.status === 200 ){
            callback(null, request.responseText );
        }
    }
    request.send( null );
};