const { SHA256 } = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var password = "123456";
// var salt = bcrypt.genSalt(10, (error, salt) => {
//   bcrypt.hash(password, salt, (error, hash) => {
//     console.log(hash);
//   });
// });
var hashPassword =
  "$2a$10$sqd6p1vlqpz6g7KRUwoH0ODM9HFrC.i3Lg4Pw20uUSAV1t922QViW";
bcrypt.compare(password, hashPassword, (error, res) => {
  console.log(res);
});
