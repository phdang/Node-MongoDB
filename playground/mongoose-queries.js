const { ObjectID } = require("mongodb");

const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/Todo");
const { User } = require("./../server/models/User");

const id = "5bc475ccbca4c36bb885e54";
if (!ObjectID.isValid(id)) {
  console.log("Todos ID not valid");
} else {
  // Todo.find({
  //   _id: id
  // }).then(
  //   todos => {
  //     if (todos.length < 1) {
  //       return console.log("Todos Id not found!");
  //     }
  //     console.log("Todo by find", todos);
  //   },
  //   error => {
  //     console.log(error);
  //   }
  // );
  //
  // Todo.findOne({
  //   _id: id
  // }).then(
  //   todo => {
  //     if (!todo) {
  //       return console.log("Todos Id not found!");
  //     }
  //     console.log("Todo By findOne", todo);
  //   },
  //   error => {
  //     console.log(error);
  //   }
  // );

  Todo.findById(id).then(
    todo => {
      if (!todo) {
        return console.log("Todos Id not found!");
      }
      console.log("Todo By findById ", todo);
    },
    error => {
      console.log(error);
    }
  );
}
var userId = "5bbb6de378a8e356961ce4b2";

User.findById(userId).then(
  user => {
    if (!user) {
      return console.log("User Id not found!");
    }
    console.log("User By findById ");
    console.log(JSON.stringify(user, null, 2));
  },
  error => {
    console.log(error);
  }
);
