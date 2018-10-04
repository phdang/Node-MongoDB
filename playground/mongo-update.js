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

    //Todos Collection

    // const Todos = client.db(dbName).collection("Todos");
    // const todo = {
    //   _id: new ObjectID("5bb63b7e16cfd32c0105dd13")
    // };
    //
    // Todos.findOneAndUpdate(
    //   todo,
    //   {
    //     $set: {
    //       completed: true
    //     }
    //   },
    //   {
    //     returnOriginal: false
    //   }
    // ).then(
    //   result => {
    //     console.log("Todos");
    //     console.log(result);
    //   },
    //   error => {
    //     console.log("Unable to update Todos ", error);
    //   }
    // );

    //User collection

    const Users = client.db(dbName).collection("Users");
    const user = {
      _id: new ObjectID("5bb6393416cfd32c0105dcfe")
    };

    Users.findOneAndUpdate(
      user,
      {
        $set: {
          name: "Mark"
        },
        $inc: {
          age: 1
        }
      },
      {
        returnOriginal: false
      }
    ).then(
      result => {
        console.log("Users");
        console.log(result);
      },
      error => {
        console.log("Unable to update Users ", error);
      }
    );

    client.close(); //close the connection
  }
);
