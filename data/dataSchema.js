(function (dataSchema) {

var mongoose = require('mongoose');

var opSchema = mongoose.Schema({
    	opId : Number,
    	opName : String,
    	opCategory : String,
    	opCmd : String,
    	opType : String,
    	opDescr : String,
    	opParams : Number
	});

 
var OpIvs = mongoose.model('OpIvs', opSchema, 'opivs');
})(module.exports);