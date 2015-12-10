
var mongoose = require('mongoose');

var opSchema = mongoose.Schema({
    	opId : Number,
    	opCmd : String,
    	opType : String,
    	opDescr : String,
    	opCategory : String,
    	opParams : Object
	});

 
module.exports = mongoose.model('OpIvs', opSchema, 'opivs');
