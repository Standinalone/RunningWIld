// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var User       = require('../../models/user');

// define the schema for our Photographer model
var statsSchema = mongoose.Schema(
    {
        level       : Number,
        seconds     : Number,
        minutes     : Number,
        ms          : Number,
        user        : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }
);

module.exports = mongoose.model('Stats', statsSchema);