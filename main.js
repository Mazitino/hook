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

//Db
const db = require("./models");

db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlPasrser: true,
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
