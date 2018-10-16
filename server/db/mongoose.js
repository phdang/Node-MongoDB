const mongoose = require("mongoose");

var env = process.env.NODE_ENV;

if (env === "development") {
  mongoose.connect(
    "mongodb://localhost:27017/TodoApp",
    { useNewUrlParser: true }
  );
} else if (env === "test") {
  mongoose.connect(
    "mongodb://localhost:27017/TodoAppTest",
    { useNewUrlParser: true }
  );
}

module.exports = { mongoose };
