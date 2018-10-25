const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
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
    minlength: [3, "Too few words"],
    unique: [true, "Email has been taken"]
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must have at least 6 characters"]
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

userSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = "auth";
  var token = jwt
    .sign({ _id: user._id.toHexString(), access }, "abc123")
    .toString();
  user.tokens.concat([
    {
      access,
      token
    }
  ]);
  return user
    .model("User")
    .findByIdAndUpdate(user._id.toHexString(), {
      $push: { tokens: { $each: [{ access, token }] } }
    })
    .then(() => ({ access, token }));
};

userSchema.methods.toJSON = function() {
  var user = this;
  return { _id: user._id, email: user.email };
};

userSchema.statics.findByToken = function(token) {
  var user = this;
  var decoded;
  try {
    decoded = jwt.verify(token, "abc123");
  } catch (error) {
    return new Promise((resolve, reject) => {
      reject(error);
    });
  }
  return User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};
var User = mongoose.model("User", userSchema);

module.exports = { User };
