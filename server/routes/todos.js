const { Todo } = require("../models/Todo");

module.exports = app => {
  app.post("/todos", (req, res) => {
    var todo = new Todo({
      text: req.body.text
    });
    todo.save().then(
      doc => {
        console.log("Save Todo, ", doc);
        res.status(201).send({ message: "Todo Saved", Todo: doc });
      },
      error => {
        console.log("Unable to save Todo ", error);
        res.status(400).send({
          message: "Todo not saved ",
          error: error.errors.text.message
        });
      }
    );
  });
  app.get("/todos", (req, res) => {
    Todo.find().then(
      todos => {
        res.status(200).send({ todos });
      },
      error => {
        console.log(error);
        res.status(404).send(error);
      }
    );
  });
};
