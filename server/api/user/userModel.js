var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  lastName: String,
  gender: Boolean,
  birthday: Date,
  nationality: String,
  password: String,
  lost: Boolean,
  location: String,
  helper: {
    type: String,
    enum: ["deliver", "rescuer", ""]
  }
});

module.exports = mongoose.model('user', userSchema);
