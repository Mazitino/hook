const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const { user } = require("../models");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


//Авторизация пользователя -----------------------
exports.login = (req, res) => {
  try {
  console.log(req.body);
  User.findOne({
    login: req.body.login
  })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ 
          status: 500,
          message: "Internal server error" 
        });
        return;
      }

      if (!user) {
        return res.status(404).send({ 
          status: 404,
          message: "Пользователь не найден" 
        });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          status: 401,
          message: "Не правильный пароль"
        });
      }

      var token = jwt.sign({ id: user.id, role: user.role }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      
      //Отправка ответа
      res.status(200).send({
        status: 200,
        data: {
          id: user._id,
          login: user.login,
          role: user.role,
          token: token
        }
      });
    });
  
  }catch(e){
    console.log(e)
    res.status(400).send({
      status: 400,
      message: "Ошибка: Авторизация пользователя"
    });  
  }
};