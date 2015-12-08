(function (wsGet) {
var ssh = require("sequest");
var sshKey = require("./configSsh.js");


var seq = sequest.connect(sshKey.UserName@sshKey.linuxMachine, {
	publicKey : sshKey.sshPublicKey} );
}


function getWsUser()
{

seq.write('ls -la')
seq.write('touch testfile')
seq.write('ls -la')
seq.end()
}


})(module.exports);