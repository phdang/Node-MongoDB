const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("../server");
const { User } = require("../models/User");
const { Todo } = require("../models/Todo");
const { todos, populateTodos, users, populateUsers } = require("./seeds/seeds");

beforeEach(populateUsers);

beforeEach(populateTodos);

describe("POST /todos", () => {
  it("should create a new todo", done => {
    var text = "Text to do test";
    request(app)
      .post("/todos")
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
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe("GET /todos/:id", () => {
  it("should return first id todo", done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });
  it("should return second id todo", done => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[1].text);
      })
      .end(done);
  });
  it("should return 404 if todo not found", done => {
    const wrongTodoId = "5bc48259e4fcf36f6e6a6f2a";
    const errorMsg = "Todo Id not found !";
    request(app)
      .get(`/todos/${wrongTodoId}`)
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
            expect(todo).toNotExist();
            done();
          })
          .catch(error => done(error));
      });
  });

  it("should return second id todo after being deleted", done => {
    request(app)
      .delete(`/todos/${todos[1]._id.toHexString()}`)
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
            expect(todo).toNotExist();
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
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA("number");
      })
      .end(done);
  });

  it("should clear completedAt when todo is not completed", done => {
    const todoId = todos[0]._id.toHexString();
    const text = "This is a new update text";
    request(app)
      .patch(`/todos/${todoId}`)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});

describe("GET /users/me", () => {
  it("should return user if authenticated", done => {
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it("should return 401 status if user is not autheticated JWT message", done => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect(res => {
        expect(res.body.message).toBe("jwt must be provided");
      })
      .end(done);
  });

  it("should return 401 status if user is not autheticated and malformed token message", done => {
    request(app)
      .get("/users/me")
      .set("x-auth", "1234")
      .expect(401)
      .expect(res => {
        expect(res.body.message).toBe("jwt malformed");
      })
      .end(done);
  });
});

describe("POST /users", () => {
  it("should create a user", done => {
    const email = "example@gmail.com";
    const password = "123456abc";
    request(app)
      .post("/users")
      .send({ email, password })
      .expect(201)
      .expect(res => {
        expect(res.headers["x-auth"]).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end(error => {
        if (error) {
          return done(error);
        }
        User.findOne({ email })
          .then(user => {
            expect(user).toExist();
            expect(user.password).toNotBe(password);
            done();
          })
          .catch(error => done(error));
      });
  });

  it("should return a validation error if a request invalid", done => {
    request(app)
      .post("/users")
      .send({ email: "example", password: "12345" })
      .expect(400)
      .end(done);
  });

  it("should not create a user if email has been taken already", done => {
    request(app)
      .post("/users")
      .send({ email: users[0].email, password: users[0].password })
      .expect(400)
      .end(done);
  });
});

describe("POST /users/login", () => {
  it("should login user and return token", done => {
    request(app)
      .post("/users/login")
      .send({ email: users[1].email, password: users[1].password })
      .expect(200)
      .expect(res => {
        expect(res.header["x-auth"]).toExist();
      })
      .end((error, res) => {
        if (error) {
          return done(error);
        }
        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens.length).toBe(2);
            expect(user.tokens[1]).toInclude({
              access: "auth",
              token: res.headers["x-auth"]
            });

            done();
          })
          .catch(error => done(error));
      });
  });

  it("should reject invalid login", done => {
    request(app)
      .post("/users/login")
      .send({ email: users[0].email, password: users[1].password })
      .expect(400)
      .expect(res => {
        expect(res.header["x-auth"]).toNotExist();
      })
      .end((error, res) => {
        if (error) {
          return done(error);
        }
        User.findById(users[0]._id)
          .then(user => {
            expect(user.tokens.length).toBe(1);
            done();
          })
          .catch(error => done(error));
      });
  });
});
