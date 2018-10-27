const mongoose = require("mongoose");

var env = process.env.NODE_ENV;

if (env === "development") {
  mongoose.connect(
    process.env.MONGODB_URI,
    { useCreateIndex: true, useNewUrlParser: true }
  );
  mongoose.set("useFindAndModify", false);
} else if (env === "test") {
  mongoose.connect(
    process.env.MONGODB_URI,
    { useCreateIndex: true, useNewUrlParser: true }
  );
  mongoose.set("useFindAndModify", false);
}

module.exports = { mongoose };
