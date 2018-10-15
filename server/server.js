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

require("./routes/todos")(app);

const PORT = process.env.PORT || 6069;

const server = https.createServer(app);

app.listen(PORT, () => {
  console.log("Server is running on port %d", PORT);
});

module.exports = { app };
