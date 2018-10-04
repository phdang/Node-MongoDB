const url = require("url");
//const MongoClient = require("mongodb").MongoClient;
const { MongoClient } = require("mongodb"); //structuring new ES6;

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

    // const col = client.db(dbName).collection("Todos");
    //
    // col.insertOne(
    //   {
    //     text: "Something to do",
    //     completed: false
    //   },
    //   (error, result) => {
    //     if (error) {
    //       return console.log("Unable to insert todo ", error);
    //     }
    //     console.log(JSON.stringify(result.ops, null, 2));
    //   }
    // );

    const Users = client.db(dbName).collection("Users");
    const user = {
      name: "phDang",
      age: 24,
      location: "KDC VL HCM city"
    };
    Users.insertOne(user, (error, result) => {
      if (error) {
        return console.log("Unable to insert todo ", error);
      }
      console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), null, 2)); //get time when a new record was inserted
    });

    client.close(); //close the connection
  }
);
