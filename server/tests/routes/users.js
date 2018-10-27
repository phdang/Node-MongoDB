const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("../../server");
const { User } = require("../../models/User");
const { users, populateUsers } = require("../seeds/seeds");

beforeEach(populateUsers);

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
        expect(res.headers["x-auth"]).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end(error => {
        if (error) {
          return done(error);
        }
        User.findOne({ email })
          .then(user => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
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
        expect(res.header["x-auth"]).toBeTruthy();
      })
      .end((error, res) => {
        if (error) {
          return done(error);
        }
        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens.length).toBe(2);
            expect(user.tokens[1]).toMatchObject({
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
        expect(res.header["x-auth"]).toBeFalsy();
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

describe("DELETE /users/me/token", () => {
  it("should remove auth token on logout", done => {
    request(app)
      .delete("/users/me/token")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.message).toBe("log out susccessfully");
      })
      .end((error, res) => {
        if (error) {
          return done(error);
        }
        User.findById(users[0]._id)
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(error => done(error));
      });
  });
});
