var mongoose = require('mongoose')


var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
  id        : ObjectId,
  name      : String,
  last_name : String,
  email     : String,
  password : String
})

var UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel
