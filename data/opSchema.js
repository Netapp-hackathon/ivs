
var mongoose = require('mongoose');

var opSchema = mongoose.Schema({
    	opId : Number,
    	opCmd : String,
    	opType : String,
    	opDescr : String,
    	opParams : Number
	});

 
module.exports = mongoose.model('OpIvs', opSchema, 'opivs');
