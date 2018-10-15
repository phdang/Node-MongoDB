const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/Todo");
const { User } = require("./../server/models/User");

// Todo.findOneAndDelete({ text: "Walk the dogs" }).then(
//   result => {
//     console.log(result);
//   },
//   error => {
//     console.log(error);
//   }
// );
const todoId = "5bc487fc76238f7108fa7017";
Todo.findByIdAndDelete(todoId).then(
  result => {
    console.log(result);
  },
  error => {
    console.log(error);
  }
);
