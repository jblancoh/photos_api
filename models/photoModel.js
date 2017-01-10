var mongoose = require('mongoose')
var user = require('../models/userModel')
var comment = require('../models/commentModel')

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var PhotoSchema = new Schema({
  title     : String,
  url       : String,
  likes     : Number,
  user      : String,
  tag_user  :[{
    type: ObjectId,
    ref : "user"
  }],
  comment  : [{
    type: ObjectId,
    ref: "comment"
  }]
})

var PhotoModel = mongoose.model('photo', PhotoSchema);

module.exports = PhotoModel
