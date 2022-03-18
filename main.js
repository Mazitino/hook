const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const dbConfig = require("./config/db.config");
const app = express();

//Cors
var corsOptions = {origin: "http://localhost:8081"};
app.use(cors(corsOptions));

//Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//DataBase
const db = require("./models");

db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        show_users(); //Show all current users in DB on trmianal
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

 // Smple route
 app.get("/", (req, res) => {
    res.json({ message: "Welcome to application." });
  });


  // Set port, listen for requests
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });









  //Add first user admin (dev test)
function initial(){
  const User = db.user;
  const user_test = new User({
    login: "Admin",
    password: bcrypt.hashSync("1234",8),
    role: "admin"
  }).save(err => {
    if(err){
      console,log("error", err);
    }
    console.log("added 'user' to roles cpllection");
  });
}

  //Show all users (dev check)
function show_users() {
  const User = db.user;
  User.find({}, function(err, users){
    if(err) return console.log(err);
    console.log("All users: ", users);
  }); 
}