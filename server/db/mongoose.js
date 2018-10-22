const mongoose = require("mongoose");

var env = process.env.NODE_ENV;

if (env === "development") {
  mongoose.connect(
    "mongodb://localhost:27017/TodoApp",
    { useCreateIndex: true, useNewUrlParser: true }
  );
  mongoose.set("useFindAndModify", false);
} else if (env === "test") {
  mongoose.connect(
    "mongodb://localhost:27017/TodoAppTest",
    { useCreateIndex: true, useNewUrlParser: true }
  );
  mongoose.set("useFindAndModify", false);
}

module.exports = { mongoose };
