var mongoose = require('mongoose')
var user = require('../models/userModel')
var photo = require('../models/photoModel')

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var CommentSchema = new Schema({
  author    : {
      type: ObjectId,
      ref: "user"
  },
  comment   : String,
  photo  : {
    type: ObjectId,
    ref: "photo"
  }
});

var CommentModel = mongoose.model('comment', CommentSchema);

module.exports = CommentModel
