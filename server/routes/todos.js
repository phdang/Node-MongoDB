const _ = require("lodash");

const { ObjectID } = require("mongodb");

const { Todo } = require("../models/Todo");

module.exports = app => {
  app.post("/todos", (req, res) => {
    var todo = new Todo({
      text: req.body.text
    });
    todo.save().then(
      doc => {
        console.log("Save Todo, ", doc);
        res.status(201).send({ message: "Todo Saved", todo: doc });
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

  app.get("/todos/:id", (req, res) => {
    var todoId = req.params.id;
    if (!ObjectID.isValid(todoId)) {
      console.log("Todo Id is invalid");
      res.status(404).send({ error: "Todo Id not found !" });
    } else {
      Todo.findById(todoId)
        .then(todo => {
          if (!todo) {
            console.log("Todo Id is not found");

            res.status(404).send({ error: "Todo Id not found !" });
          } else {
            res.status(200).send({ todo });
          }
        })
        .catch(error => {
          //res.status(404).send({ error });
          console.log(error);
        });
    }
  });
  app.delete("/todos/:id", (req, res) => {
    var todoId = req.params.id;
    if (!ObjectID.isValid(todoId)) {
      console.log("Todo Id is invalid");
      res.status(404).send({ error: "Todo Id not found !" });
    } else {
      Todo.findByIdAndDelete(todoId)
        .then(todo => {
          if (!todo) {
            console.log("Todo Id is not found");
            res.status(404).send({ error: "Todo Id not found !" });
          } else {
            console.log("To do ", JSON.stringify(todo, null, 2));
            console.log("Deleted susccessfully");
            res
              .status(200)
              .send({ todo, message: "Todo deleted susccessfully" });
          }
        })
        .catch(error => {
          res.status(404).send({ error });
        });
    }
  });
  app.patch("/todos/:id", (req, res) => {
    var todoId = req.params.id;

    // first solution using lodash

    // var body = _.pick(req.body, ["text", "completed"]);
    // if (!ObjectID.isValid(todoId)) {
    //   console.log("Todo Id is invalid");
    //   res.status(404).send({ error: "Todo Id not found !" });
    // } else {
    //   if (_.isBoolean(body.completed) && body.completed) {
    //     body.completedAt = new Date().getTime();
    //   } else {
    //     body.completed = false;
    //     body.completedAt = null;
    //   }
    //   Todo.findByIdAndUpdate(todoId, { $set: body }, { new: true })
    //     .then(todo => {
    //       if (!todo) {
    //         res.status(404).send({ error });
    //       } else {
    //         res.status(200).send({ todo });
    //       }
    //     })
    //     .catch(error => {
    //       res.status(404).send({ error });
    //     });
    // }

    //Second Solution
    if (!ObjectID.isValid(todoId)) {
      console.log("Todo Id is invalid");
      res.status(404).send({ error: "Todo Id not found !" });
    }
    const newTodo = new Todo();
    newTodo._id = ObjectID(todoId);
    newTodo.text = req.body.text;
    newTodo.completed = req.body.completed === true ? true : false;
    if (newTodo.completed) {
      newTodo.completedAt = new Date().getTime();
    } else {
      newTodo.completedAt = null;
    }
    Todo.findById(todoId)
      .then(todo => {
        todo.set(newTodo);
        todo.save((error, newUpdate) => {
          if (error) {
            res.status(404).send({ error });
          }
          console.log("Update Todo");
          console.log(JSON.stringify(newUpdate, null, 2));
          res.status(200).send({ todo: newUpdate });
        });
      })
      .catch(error => {
        res.status(404).send({ error });
      });
  });
};
