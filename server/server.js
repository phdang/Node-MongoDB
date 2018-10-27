// import config

require("./config/config");

//Library imports

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
//Local imports

const { mongoose } = require("./db/mongoose");
const { User } = require("./models/User");

const app = express();

//Middleware

app.use(bodyParser.json());

//Routes

//todos
require("./routes/todos")(app);
//users
require("./routes/users")(app);

const PORT = process.env.PORT;

const server = https.createServer(app);

app.listen(PORT, () => {
  console.log("Server is running on port %d fantastic yeahhhh !", PORT);
});

module.exports = { app };
