var mongoose = require('mongoose');

	var opCmdSchema = mongoose.Schema({
		eId : Number,
		opId : Number
	});
	/*var opCmdSchema = mongoose.Schema({
		username : String,
		eId : Number,
		opId : Number,
		wsId : Number,
		params : Object
	}); */

module.exports = mongoose.model('opCmdIvs', opCmdSchema, 'opcmdivs');
