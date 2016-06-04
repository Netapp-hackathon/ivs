var mongoose = require('mongoose');
//var vsimSchema = require('./vsimSchema.js');
//var wsSchema = require('./wsSchema.js');


var userSchema = mongoose.Schema({
        username : String,
        ws : [{
        	wsId : Number,
        	wsName : String,
       		wsPath : String,
        }],
        vsim : [{
        	vsimId : Number,
        	vsimName : String
        }]
});

module.exports = mongoose.model('UserIvs', userSchema, 'userivs');
