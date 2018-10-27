const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("../../server");
const { Todo } = require("../../models/Todo");
const { todos, populateTodos, users } = require("../seeds/seeds");
beforeEach(populateTodos);

describe("POST /todos", () => {
  it("should create a new todo", done => {
    var text = "Text to do test";
    request(app)
      .post("/todos")
      .set("x-auth", users[0].tokens[0].token)
      .send({ text })
      .expect(201)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(error => {
            done(error);
          });
      });
  });
  it("should not create todo with invalid body data", done => {
    request(app)
      .post("/todos")
      .set("x-auth", users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((error, res) => {
        if (error) {
          done(error);
        }
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done(error);
          })
          .catch(error => done(error));
      });
  });
});

describe("Get /todos", () => {
  it("should get all todos", done => {
    request(app)
      .get("/todos")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe("GET /todos/:id", () => {
  it("should return first id todo", done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });
  it("should return second id todo", done => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[1].text);
      })
      .end(done);
  });

  it("should not return todo doc created by other users", done => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("should return 404 if todo not found", done => {
    const wrongTodoId = "5bc48259e4fcf36f6e6a6f2a";
    const errorMsg = "Todo Id not found !";
    request(app)
      .get(`/todos/${wrongTodoId}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .expect(res => {
        expect(res.body.error).toBe(errorMsg);
      })
      .end(done);
  });
  it("should return 404 if todoId is invalid", done => {
    const invalidTodoId = "5bc48259e4fcf36f6e6a6f2";
    const errorMsg = "Todo Id not found !";
    request(app)
      .get(`/todos/${invalidTodoId}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .expect(res => {
        expect(res.body.error).toBe(errorMsg);
      })
      .end(done);
  });
});

describe("DELETE /todos/:id", () => {
  it("should return first id todo after being deleted", done => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
      })
      .end((error, res) => {
        if (error) {
          done(error);
        }
        Todo.findById(todos[0]._id.toHexString())
          .then(todo => {
            expect(todo).toBeFalsy();
            done();
          })
          .catch(error => done(error));
      });
  });

  it("should return second id todo after being deleted", done => {
    request(app)
      .delete(`/todos/${todos[1]._id.toHexString()}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(todos[1]._id.toHexString());
      })
      .end((error, res) => {
        if (error) {
          done(error);
        }
        Todo.findById(todos[1]._id.toHexString())
          .then(todo => {
            expect(todo).toBeFalsy();
            done();
          })
          .catch(error => done(error));
      });
  });

  it("should return 404 if user unauthenticated trying to delete", done => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .set("x-auth", users[1].tokens[0].token)
      .expect(404)
      .end((error, res) => {
        if (error) {
          done(error);
        }
        Todo.findById(todos[1]._id.toHexString())
          .then(todo => {
            expect(todo).toBeTruthy();
            done();
          })
          .catch(error => done(error));
      });
  });

  it("should return 404 if todo not found", done => {
    const wrongTodoId = "5bc48259e4fcf36f6e6a6f2a";
    const errorMsg = "Todo Id not found !";
    request(app)
      .get(`/todos/${wrongTodoId}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .expect(res => {
        expect(res.body.error).toBe(errorMsg);
      })
      .end(done);
  });
  it("should return 404 if todoId is invalid", done => {
    const invalidTodoId = "5bc48259e4fcf36f6e6a6f2";
    const errorMsg = "Todo Id not found !";
    request(app)
      .get(`/todos/${invalidTodoId}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .expect(res => {
        expect(res.body.error).toBe(errorMsg);
      })
      .end(done);
  });
});

describe("PATCH /todos/:id", () => {
  it("should update the todo", done => {
    const todoId = todos[0]._id.toHexString();
    const text = "This is a new text";
    request(app)
      .patch(`/todos/${todoId}`)
      .set("x-auth", users[0].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe("number");
      })
      .end(done);
  });

  it("should return 404 if trying to update if user is unauthorised", done => {
    const todoId = todos[0]._id.toHexString();
    const text = "This is a new text";
    request(app)
      .patch(`/todos/${todoId}`)
      .set("x-auth", users[1].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(404)
      .end(done);
  });

  it("should clear completedAt when todo is not completed", done => {
    const todoId = todos[1]._id.toHexString();
    const text = "This is a new update text";
    request(app)
      .patch(`/todos/${todoId}`)
      .set("x-auth", users[1].tokens[0].token)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done);
  });
});
