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
};
