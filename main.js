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
        check_users();
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

  //Вывод всех пользователей (для проверки)
function check_users() {
    const User = db.user;
    User.find({}, function(err, users){
      if(err) return console.log(err);
      console.log(users);
    }); 
}