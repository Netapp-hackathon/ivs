(function (database) {
    
    var fs = require("fs-extra");
    var mongoose = require('mongoose');
    var ConfigIvs = require("./configSchema.js");
    var OpIvs = require("./opSchema.js");
    var UserIvs = require("./userSchema.js");
    var UserNameIvs = require("./userNameSchema.js");

    var feedpath = "C:\\Users\\tvidya\\ivs\\data\\feeddata.json";
    var userpath = "C:\\Users\\tvidya\\ivs\\data\\userfeeddata.json";
    var userNamepath = "C:\\Users\\tvidya\\ivs\\data\\userNamefeeddata.json";
    

	//Lets connect to our database using the DB server URL.
	mongoose.connect('mongodb://localhost:27017/ivsOpDb1');
 
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function () {
 		//console.log(" DB connection successful ");
	});

	/* *
	* Lets define our Model for Op entity. This model represents a collection in the database.
 	* We define the possible schema of Op document and data types of each field.
 	* */
	
    database.init = function (callback_func) {
    	ConfigIvs.findOne({confDbInited : "true"}, function(err, result) {   
  			if (err || !result ) {
  				fs.readJson(feedpath, function (err, outPutObject) {
  					// console.log("Jason Object is " + outPutObject);
            if (err) {
             	console.log("Failed to open file " + err + " " + feedpath);  
            	callback_func(err, null);                 
            }
          	else {
          		// console.log("outPutObject length" + outPutObject.length);
              for(var index = 0; index < outPutObject.length; index++)
          		{
                // console.log("Individual Object" + outPutObject[index]);
    						var opsNew = new OpIvs(outPutObject[index]);
       					opsNew.save(function(err, opsNew) {
  								if (err) {
  									console.error("Failed to save " + err);
  									callback_func(err, null);
  								} else {
 								  	// console.log( "Saved to db" + opsNew);
  								}
							 });
              }
            }
          });
            fs.readJson(userpath, function (err, outPutObject) {
              // console.log("Jason Object is " + outPutObject);
              if (err) {
                console.log("Failed to open file " + err);  
                callback_func(err, null);                 
              }
              else {
                // console.log("outPutObject length" + outPutObject.length);
                for(var index = 0; index < outPutObject.length; index++)
                {
                  // console.log("Individual Object " + outPutObject[index].username);
                  var userNew = new UserIvs(outPutObject[index]);
                  //var userNew = new UserIvs({username : outPutObject[index].username, ws : outPutObject[index].ws, vsim : outPutObject[index].vsim});
                  userNew.save(function(err, userNew) {
                    if (err) {
                      console.error("Failed to save " + err);
                      callback_func(err, null);
                    } else {
                      // console.log( "Saved to db" + userNew);
                    }
                  });
						    }
              }
            }); 
            /*         
            fs.readJson(userNamepath, function (err, outPutObject) {
              // console.log("Jason Object is " + outPutObject);
              if (err) {
                console.log("Failed to open file " + err);  
                callback_func(err, null);                 
              }
              else {
                // console.log("outPutObject length" + outPutObject.length);
                for(var index = 0; index < outPutObject.length; index++)
                {
                  // console.log("Individual Object " + outPutObject[index].username);
                  var userNew = new UserNameIvs(outPutObject[index]);
                  //var userNew = new UserIvs({username : outPutObject[index].username, ws : outPutObject[index].ws, vsim : outPutObject[index].vsim});
                  userNew.save(function(err, userNew) {
                    if (err) {
                      console.error("Failed to save " + err);
                      callback_func(err, null);
                    } else {
                      // console.log( "Saved to db " + userNew);
                    }
                  });
                }
              }
            }); */         
  				var configDb = new ConfigIvs({ confDbInited : true, confAirlockCtr : 0, confAirWsCtr : 0, confAirOpCtr : 0});
  				configDb.save(function(err, configDb) {
  								if (err) {
  									console.error("Failed to save config db " + err);
  									callback_func(err, null);
  								} else {
 								 	 // console.log("Saved config db " + configDb);
  								}
  				})
  			} else {
  				console.log("DB has already Inited");
  			}
              
        });
        callback_func(null, true);
    };

})(module.exports);
