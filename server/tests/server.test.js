const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("../server");

const { Todo } = require("../models/Todo");
const todos = [
  {
    _id: new ObjectID(),
    text: "First text todo"
  },
  {
    _id: new ObjectID(),
    text: "Second text todo"
  }
];
beforeEach(done => {
  Todo.deleteMany({})
    .then(() => {
      Todo.insertMany(todos);
    })
    .then(() => done());
});

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
