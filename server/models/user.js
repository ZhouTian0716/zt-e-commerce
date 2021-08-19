const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required:  true },
  email: { type: String, required: true, unique: true, match: [/.+@.+\..+/, 'Must use a valid email address']},
  password: { type: String, required: true },
});

var User = mongoose.model("User", userSchema);


module.exports = User;