(function (wsGet) {
var fs = require("fs");
var sequest = require("sequest");
var sshKey = require("./configSsh.js");
var userdb = require("./userDb.js");
var UserIvs = require("./userSchema.js");
var path = require("./configPath.js");


var machine = sshKey.UserName + "@" + sshKey.linuxMachine;
//console.log("ssh machine name  " + machine + "\npublicKey  " +sshKey.sshPublicKey);
var seq = sequest(machine, {
	privateKey : sshKey.sshPrivateKey,
	publicKey : sshKey.sshPublicKey}, function (err, stdout) {
    if (err) {
    	console.log("Failed to ssh connect" + err);
    } else {
    	//console.log("connect ssh successful");
    }
});

function startWsUser(err, users) {
//	seq.write('rm /u/tvidya/wsUserClient.json');
	if (err) {
		console.log ("No users to fetchp4clients")
		return;
	}
	
	//console.log("User id for ws get is " + users);
	var p4Cmd = "./fetchp4clients.sh " + users +" /u/tvidya/wsUserClient.json";
	//console.log("P4 command " + p4Cmd);
	seq.write(p4Cmd);

}

function readfromLinux(){
    // this code will only run when time has ellapsed
    var writableStream = fs.createWriteStream(path.wspathLinux);

	var c = sequest.connect(machine, {
			privateKey : sshKey.sshPrivateKey,
			publicKey : sshKey.sshPublicKey}), wsUserClient = c.get('/u/tvidya/wsUserClient.json');
			//publicKey : sshKey.sshPublicKey}), wsUserClient = c.get('/u/tvidya/wsUserClient.json');
	wsUserClient.pipe(writableStream);
	//wsUserClient.pipe(process.stdout);
	writableStream.on('finish', function (err, result){
		//console.log("On write complete");
		if(err) {
			console.log ("Failed to pipe ws file " + err);
		} else {
			userdb.writeWsDb(null);
		}
	});
}

function getWsUser()
{
	fs.truncate(path.wspathLinux, 0, function(err, result){
		if (err) {
			console.log("Failed to truncate ws linux file");
			userdb.getAllUsers(startWsUser);
		} else {
			userdb.getAllUsers(startWsUser);
		}
	});
	
}
setInterval(readfromLinux, 1010000);

setTimeout(function(){
	readfromLinux();
}, 10000);
setTimeout(function(){
    // this code will only run when time has ellapsed
    getWsUser();
}, 3000);
setInterval(getWsUser, 1000000);
})(module.exports);