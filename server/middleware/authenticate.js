const { User } = require("../models/User");

const authenticate = (req, res, next) => {
  var token = req.header("x-auth");
  User.findByToken(token)
    .then(user => {
      if (!user) {
        return Promise.reject("No user found");
      }
      req.user = user;
      req.token = token;
      next();
    })
    .catch(error => {
      res.status(401).send(error);
    });
};

module.exports = authenticate;
