const { SHA256 } = require("crypto-js");
const jwt = require("jsonwebtoken");
// var message = "iamauserno3";
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
var data = {
  id: 5
};
var token = jwt.sign(data, "123abc");
console.log(token);
var decoded = jwt.verify(token, "123abc");
console.log(decoded);
