var mongoose = require('mongoose')
var user = require('../models/userModel')

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var CommentSchema = new Schema({
  author    : {
      type: ObjectId,
      ref: "user"
  },
  comment   : String

});

var CommentModel = mongoose.model('comment', CommentSchema);

module.exports = CommentModel
