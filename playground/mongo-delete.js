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
    //   completed: false
    // };

    const Users = client.db(dbName).collection("Users");
    const user = {
      _id: new ObjectID("5bb63e4216cfd32c0105dd2b")
    };

    //Todos Collection

    //delete many
    // Todos.deleteMany(todo).then(
    //   result => {
    //     console.log("Records deleted");
    //     console.log(result);
    //   },
    //   error => {
    //     console.log("Unable to delete record ", error);
    //   }
    // );
    //deleteOne
    // Todos.deleteOne(todo).then(
    //   result => {
    //     console.log("Records deleted");
    //     console.log(result);
    //   },
    //   error => {
    //     console.log("Unable to delete record ", error);
    //   }
    // );
    //findOneAndDelete
    // Todos.findOneAndDelete(todo).then(
    //   result => {
    //     console.log("Records deleted");
    //     console.log(result);
    //   },
    //   error => {
    //     console.log("Unable to delete record ", error);
    //   }
    // );

    //User collection
    Users.findOneAndDelete(user).then(
      result => {
        console.log("Records deleted");
        console.log(result);
      },
      error => {
        console.log("Unable to delete record ", error);
      }
    );
    client.close(); //close the connection
  }
);
