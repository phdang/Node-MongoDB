const { ObjectID } = require("mongodb");

const { User } = require("../models/User");

const authenticate = require("../middleware/authenticate");

module.exports = app => {
  app.post("/users", (req, res) => {
    var newUser = new User();
    newUser.email = req.body.email;
    newUser.password = req.body.password;
    newUser
      .save()
      .then(() => {
        console.log("User created susccessfully!");
        //res.status(201).send(newUser);
        return newUser.generateAuthToken();
      })
      .then(data => {
        var user = { ...newUser._doc };
        user.tokens = newUser.tokens.concat([data]);
        res
          .header("x-auth", data.token)
          .status(201)
          .send({ _id: user._id, email: user.email });
      })

      .catch(error => {
        console.log("User was not created!");
        console.log("Error :", error);
        res.status(400).send(error);
      });
  });

  app.get("/users/me", authenticate, (req, res) => {
    res.status(200).send(req.user);
  });
  app.delete("/users/me/token", authenticate, (req, res) => {
    req.user.removeToken(req.token).then(
      () => {
        res.status(200).send({ message: "log out susccessfully" });
      },
      error => {
        res.status(400).send(error);
      }
    );
  });

  app.post("/users/login", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    User.findByCredentials(email, password)
      .then(user => {
        return user.generateAuthToken().then(data => {
          res.header("x-auth", data.token);
          res.status(200).send(user);
        });
      })
      .catch(error => {
        res.status(400).send(error);
      });
  });
};
