 var mongoose = require('mongoose');
var vsimSchema = mongoose.Schema({
        VsimId : Number,
        VsimName : String
});

module.exports = mongoose.model('VsimIvs', userSchema, 'vsimivs');
