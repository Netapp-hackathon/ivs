(function (ophandler) {
var fs = require("fs-extra");
var mongoose = require('mongoose');
var ConfigIvs = require("./configSchema.js");
var OpIvs = require("./opSchema.js");
var path =  require("./configPath.js");
var OpCmdIvs = require("./opCmdSchema.js");
var UserIvs = require("./userSchema.js");
var sequest = require("sequest");
var sshKey = require("./configSsh.js");

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

function fetchWsPath(cmdEntry, callback_func)
{
    UserIvs.findOne({ 'username' : cmdEntry.username}, function(err, userObj) {
        if (err) {
            console.log ( "Failed to read op db in run_cmd");
            callback_func(null);
        } else {
            for (var i = userObj.ws.length - 1; i >= 0; i--) {
                if (userObj.ws[i].wsId === cmdEntry.wsId ) {
                    //console.log("Retrived ws path for user " + cmdEntry.username + " ws path " + userObj.ws[i].wsPath);
                    callback_func(userObj.ws[i].wsPath);
                };
            };
            //callback_func(null);
        }
    }); 
}
function runCmd(cmdString, dbObject, callback_func)
{
    //console.log("in runCmd " + cmdString);
    seq.write(cmdString);
   // console.log("executed in runCmd " + cmdString);
    //var p4Cmd = "./fetchp4clients.sh tvidya /u/tvidya/netapp.json";
    //seq.write(p4Cmd);
    callback_func(null, dbObject);
}
function prepCmd(cmdEntry, callback_func)
{
    //console.log("prepcmd op Id before lookup " + cmdEntry.opId);
    //OpIvs.find({}, function(err, opObj) {
    OpIvs.findOne({"opId" : cmdEntry.opId}, function(err, opObj) {
        if (err) {
            console.log ( "Failed to read op db in run_cmd");
            callback_func(err, null, null);
        } else {
            //console.log("Prepcmd opid " + cmdEntry.opId + " opcmd " + opObj.opCmd);
            var cmdString = "";
            switch ( cmdEntry.opId) {
                case 0 :
                case 1 : 
                    fetchWsPath(cmdEntry, function(wsPath){
                        opcmd=opObj.opCmd;
                        opcmd = opcmd.replace('BUILDPATH', wsPath);
                        //console.log("cmd string generated for build is " + cmdString);

                        callback_func(null, opcmd, cmdEntry);

                    });
                    
                    break;
                case 2:
                    fetchWsPath(cmdEntry, function(wsPath){
                        opcmd = opObj.opCmd;
                        opcmd = opcmd.replace('WHOAMI', cmdEntry.username);
                        opcmd = opcmd.replace('BUILDPATH', wsPath);
                        opcmd = 'ssh cycl01.smoke.eng.btc.netapp.in "' +  opcmd + '"';  
                        //console.log("cmd string generated for build is " + opcmd);
                        callback_func(null, opcmd, cmdEntry);

                    });
                    break;
                case 3:
                    fetchWsPath(cmdEntry, function(wsPath){
                        opcmd = opObj.opCmd;
                        opcmd = opcmd.replace('BUILDPATH', wsPath); 
                        //console.log("cmd string generated for build is " + opcmd);
                        callback_func(null, opcmd, cmdEntry);

                    });
                    break;
                default : 
                    console.log("Unsupported opId " + cmdEntry.opId);                    

            }
            //callback_func(null, cmdString, cmdEntry);
        }
    });

}

function readandexec(filepath, callback_func)
{
    fs.readJson(filepath, function (err, outPutObject) {
        //console.log("Jason Object in readdb is " + outPutObject);
        if (err) {
            console.log("Failed to open file " +filepath + " " + err);  
            callback_func(err, null);                 
        }
        else {
            //console.log("outPutObject length" + outPutObject.length);
            for(var index = 0; index < outPutObject.length; index++)
            {
                //console.log("Individual Object in readdb" + outPutObject[index]);
                prepCmd(outPutObject[index], function(err, cmdString, dbObject){
                    if(err) {
                        console.log("Failed to prepare cmd for user " + outPutObject[index].username + " cmd " + outPutObject[index].opId);
                        callback_func(err, null);
                    } else {
                        runCmd(cmdString, dbObject, function(err, dbObject) {
                            if (err) {
                                console.log("Failed to run cmd " + err);
                                callback_func(err, null);
                            } else {
                                //console.log("Suceessfully ran cmd, storing cmd to db");
                                var opCmdEntry = new OpCmdIvs({opId : dbObject.opId, eId : dbObject.eId});
                                //var userNew = new UserIvs({username : outPutObject[index].username, ws : outPutObject[index].ws, vsim : outPutObject[index].vsim});
                                opCmdEntry.save(function(err, opCmdEntry) {
                                    if (err) {
                                        console.error("Failed to save " + err);
                                        callback_func(err, null);
                                    } else {
                                        //console.log( "Saved to db " + opCmdEntry);
                                        callback_func(null, opCmdEntry);
                                    }
                                });
                            }
                        });
                    }
                });
                
            }
        }
    });          
}
function readOpcmdsfromAir()
{
    
    ConfigIvs.find({}, 'confAirlockCtr', function(err, configObj) {
            if (err) {
                console.log("failed to retrive counter for ops cmd");
            } else {
               // console.log("Gonna read ops cmd from airlock counter " + configObj[0].confAirlockCtr);
                //console.log("Writing ops to airlock counter " + counter[0] + " " +  counter);
                var counter = configObj[0].confAirlockCtr;
               // var srcfilename = path.airPath + "ops_exec_" + counter;
                var srcfilename = path.airPath + path.opsExecFormat + counter;
                readandexec(srcfilename, function(err, result){
                    if (err) {
                        console.error("Failed to execute commands from " + srcfilename);
                    } else {
                       // console.log( "Suceessfully executed commands from " + srcfilename);
                    }
                });
                
            }
    });
}
setInterval(readOpcmdsfromAir, 5 * 60 * 1000);
setTimeout(function(){
    // this code will only run when time has ellapsed
    readOpcmdsfromAir();
}, 50000);
//setInterval(readOpcmdsfromAir, 300000);
function writeOpToAir ()
{
    OpIvs.find({},'opId opType opDescr opParams -_id').lean().exec(function (err, ops) {
    //OpIvs.find().lean().exec(function (err, users) {
        var opJson = (JSON.stringify(ops));
        //console.log("writeOpToAir : stringify obj " + opJson);
        ConfigIvs.find({}, function(err, configObj) {
            if (err) {
                console.log("failed to retrive counter for ops");
            } else {
                //console.log("Writing ops to airlock counter " + configObj[0].confAirOpCtr);
                //console.log("Writing ops to airlock counter " + counter[0] + " " +  counter);
                var counter = configObj[0].confAirOpCtr;
                var srcfilename = path.tempPath + "op";
                var dstfilename = path.airPath + path.opsCmdFormat + counter;
                fs.writeFile(srcfilename, opJson , function(err) {
                    if(err) {
                        console.log("Failed to write opAir file " + err);
                    } else {
                        //console.log("Hurray wrote opAir file ");
                        fs.copy(srcfilename, dstfilename, function(err, result) {
                            if(err){
                                console.log("Failed to write op airlock file " + err);
                            } else {
                                counter++;
                                //console.log ( "counter value is " + counter);
                                //configObj[0].update({}, { $set: { confAirOpCtr : counter }}, function(err, configObj) {
                                configObj[0].confAirOpCtr = counter;
                                configObj[0].save(function(err, configObj){
                                    if (err) {
                                        console.log("failed to update new confAirOpCtr " + err);
                                    } else {
                                        //console.log("updated new confAirOpCtr " + counter);
                                    } 
                                });
                            }
                        });
                        
                    }
                });
            }
        });
    }); 
}
setTimeout(function(){
    // this code will only run when time has ellapsed
    writeOpToAir();
}, 2000);
setInterval(writeOpToAir, 24 * 60 * 60 * 1000);
})(module.exports);