const expect = require("expect");
const request = require("supertest");

const { app } = require("../server");

const { Todo } = require("../models/Todo");
const todos = [
  {
    text: "First text todo"
  },
  {
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
        expect(res.body.Todo.text).toBe(text);
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
