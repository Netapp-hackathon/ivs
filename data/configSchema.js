var mongoose = require('mongoose');

	var configSchema = mongoose.Schema({
		confDbInited : Boolean,
    	confAirlockCtr : Number,
    	confAirWsCtr : Number,
    	confAirOpCtr : Number
	});

module.exports = mongoose.model('ConfigIvs', configSchema, 'configivs');
