const url = require("url");
//const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ObjectID } = require("mongodb"); //structuring new ES6;

const urlMongo = url.parse("mongodb://localhost:27017");
const dbName = "TodoApp";
MongoClient.connect(
  urlMongo.href,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to MongoDB server");
    }

    console.log("Connected to MongoDB server");

    // const Todos = client.db(dbName).collection("Todos");
    // const todo = {
    //   name: "phDang",
    //   age: 24,
    //   location: "KDC VL HCM city"
    // };
    // Todos.find({})
    //   .count()
    //   .then(
    //     counts => {
    //       console.log("Todos");
    //       console.log("Total counts: ", counts);
    //     },
    //     error => {
    //       console.log("Unable to fetch docs ", error);
    //     }
    //   );

    const Users = client.db(dbName).collection("Users");
    Users.find({ name: "Mike" })
      .toArray()
      .then(
        docs => {
          console.log("Fetch Users");
          console.log(JSON.stringify(docs, null, 2));
        },
        error => {
          console.log("Unable to fetch users");
        }
      );

    client.close(); //close the connection
  }
);
