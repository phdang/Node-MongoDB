const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var toDoSchema = new Schema({
  text: {
    type: String,
    required: [true, "Duty must have a name, right ?"],
    trim: true,
    minlength: [3, "Too few words"]
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

var Todo = mongoose.model("Todo", toDoSchema, "ToDoApp");

module.exports = { Todo };
