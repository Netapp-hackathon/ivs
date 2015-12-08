var mongoose = require('mongoose');
var vsimSchema = require('./vsimSchema.js');
var wsSchema = require('./wsSchema.js');

var userSchema = mongoose.Schema({
        userId : String,
        ws : [wsSchema],
        vsim : [vsimSchema]
});

module.exports = mongoose.model('UserIvs', userSchema, 'userivs');
