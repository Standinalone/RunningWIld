// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our Photographer model
var userSchema = mongoose.Schema(

    // local            : {
    //     login        : String,
    //     password     : String
    // }
    {
        login        : String,
        password     : String,
        levels_completed    : {type : Number, required : false, default : 0}
    }
);

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    // return bcrypt.compareSync(password, this.local.password);
    return bcrypt.compareSync(password, this.password);
};

// create the model for photographers and expose it to our app
module.exports = mongoose.model('User', userSchema);