(function (userDb) {
	var fs = require("fs-extra");
    var mongoose = require('mongoose');
    var OpIvs = require("./opSchema.js");
    var UserIvs = require("./userSchema.js");
    var VsimIvs = require("./vsimSchema.js");
    var WsIvs = require("./wsSchema.js");

 function getAllUsers()
{
	UserIvs.find({}, 'userId', function(err, users) {


}

    function createUserEntry (argument) {
    	var user = new UserIvs;
    	user.ws.WsId
    	user.ws.WsName
    	user.ws.WsPath
    	// body...
    }
    })(module.exports);