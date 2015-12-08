  var mongoose = require('mongoose');
var wsSchema = mongoose.Schema({
  		WsId : Number,
        WsName : String,
        WsPath : String,
 });

module.exports = mongoose.model('WsIvs', wsSchema, 'wsivs');
