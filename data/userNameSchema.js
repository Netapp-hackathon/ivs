var mongoose = require('mongoose');
var userNameSchema = mongoose.Schema({
        username : String
    });
module.exports = mongoose.model('UserNameIvs', userNameSchema, 'usernameivs');