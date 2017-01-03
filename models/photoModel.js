var mongoose = require('mongoose')
var user = require('../models/userModel')

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var PhotoSchema = new Schema({
  name      : String,
  url       : String,
  likes     : Number,
  user      : {
    type: ObjectId,
    ref: "user"
  }
})

var PhotoModel = mongoose.model('photo', PhotoSchema);

module.exports = PhotoModel
