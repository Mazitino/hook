const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

//Проверка токена
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ 
      status: 401,
      message: "Токен отсутсвует!" 
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ 
        status: 401,
        message: "Пользователь не авторизован!" 
      });
    }
    req.userId = decoded.id;
    next();
  });
};

//Проверка доступа
isAdmin = (req, res, next) => {
  let token = req.headers["x-access-token"];
  
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ 
        status: 401,
        message: "Пользователь не авторизован!" 
      });
    }
    req.userRole = decoded.role;

    if (req.userRole === "admin") {
      next();
      return;
    }
    
    res.status(403).send({ 
      status: 403,
      message: "Отказано в доступе" 
    });
  });
};

const authJwt = {
  verifyToken,
  isAdmin
};

module.exports = authJwt;