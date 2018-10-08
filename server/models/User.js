const mongoose = require("mongoose");

var Schema = mongoose.Schema;

//User

var userSchema = new Schema({
  email: {
    type: String,
    match: [
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      "Not a valid email"
    ],
    required: [true, "Email must not be empty"],
    trim: true,
    minlength: [3, "Too few words"]
  }
});

var User = mongoose.model("User", userSchema);

module.exports = { User };
