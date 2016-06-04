
	var fs = require("fs-extra");
    var mongoose = require('mongoose');
    var OpIvs = require("./opSchema.js");
    var UserIvs = require("./userSchema.js");
    var ConfigIvs = require("./configSchema.js");
    var UserNameIvs = require("./userNameSchema.js");
    var path = require("./configPath.js")
    
function writeEntriesToDb (outPutObject)
    {     
        //console.log("outPutObject length" + outPutObject.length);
        for(var index = 0; index < outPutObject.length; index++)
        {
            //console.log("Individual Object " + outPutObject[index]);
            var new_entry = new UserIvs(outPutObject[index]);
            //var userNew = new UserIvs({username : outPutObject[index].username, ws : outPutObject[index].ws, vsim : outPutObject[index].vsim});
            new_entry.save(function(err, new_entry) {
                if (err) {
                    console.error("Failed to save " + err);
                } else {
                    //console.log( "Saved to db" + new_entry);
                }
            });
        }

    }
function  writeWsToAir (counter) {
        //console.log("Counter value inside writeWsToAir " + counter);
        var destFileName = path.airPath + path.wsFormat + counter + ".json";
        fs.copy(path.wspathLinux, destFileName, function(err, result) {
            if(err){
                console.log("Failed to write ws airlock file " + err);
            } else {
                //console.log ("successfully wrote ws airlock file " + destFileName);
                ConfigIvs.update({ $set: { confAirWsCtr: counter++ }}, function(err, result){
                    if (err) {
                        console.log("failed to update new confAirWsCtr " + err);
                    } else {
                        //console.log("updated new confAirWsCtr " + counter);
                    }
                });
            }
        });
}
module.exports = {
    getAllUsers : function(callback_func)
    {
	   UserNameIvs.find(function(err, users) {
            var userList="";
        
            if (err) {
                console.log ("Empty User List");
                callback_func(err, null);
            } else {
               // console.log("user list length " + users.length);
                for(var index = 0; index < users.length; index++) {
                    //console.log("userdb generating user list " + users[index].username);
                    if(userList.length == 0) {
                        userList = users[index].username;
                    } else {
                       userList = userList + "," + users[index].username;
                    }
                }
                //console.log("user list " + userList);
                callback_func(null, userList);
            }
        });
    },

    writeWsDb : function(err)
    {
        UserIvs.remove({}, function(err, result) { 
            if (err) {
                console.log('Failed to remove ws collection');
            } else {
                //console.log("Deleted wsLinux File");
            } 
        });
        fs.readJson(path.wspathLinux, function (err, outPutObject) {
            //console.log("Jason Object is " + outPutObject);
            if (err) {
               // console.log("Failed to open file " + err);  
            }
            else {
                writeEntriesToDb(outPutObject);
                ConfigIvs.find(function(err, configObj) {
                    //console.log("Writing ws to airlock counter " + configObj[0].confAirWsCtr);
                        writeWsToAir(configObj[0].confAirWsCtr);
                });
            }
        });          
    }
    
}
/*
function createUserEntry (argument) {
    	var user = new UserIvs;
    	user.ws.wId
    	user.ws.wsName
    	user.ws.wsPath
    	// body...
}
});
*/