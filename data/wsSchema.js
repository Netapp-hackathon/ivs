  var mongoose = require('mongoose');
var wsSchema = mongoose.Schema({
  		wsId : Number,
        wsName : String,
        wsPath : String,
 });

module.exports = wsSchema;
