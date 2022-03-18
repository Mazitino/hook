const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const { user } = require("../models");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
  

// Получить всех пользователей с пагинацией -----------
exports.getUsers = (req, res) => {
  try {
    
    var page = parseInt(req.query.page);
    var limit = parseInt(req.query.limit);
    const startIndex = (page-1)*limit;
 
    if(!page){
      page = 1;     //Если пусто то получает страницу 1
    }

    if(!limit){
      limit = 10;   //Если пусто то лимит выводимых пользователей 10 на 1 страницу
    }

    User.find()
    .skip(startIndex)
    .limit(limit)
    .exec((err, user)=> { 

      if (err) {
        res.status(500).send({ 
          status: 500,
          message: "Внутренняя ошибка сервера"
        });
        return;
      }
      //Отправка ответа
      res.status(200).send({
        status: 200,
        user
      });
    });


       
  }catch(e){
    console.log(e)
    res.status(400).send({
      status: 400,
      message: "Ошибка: Вывод пользователей c пагинацией"
    });

  }
}

// Получить пользователя ------------------------------
exports.getUser = (req, res) => {
  try {
    

    let token = req.headers["x-access-token"];
    jwt.verify(token, config.secret, (err, decoded) => {
      req.userRole = decoded.role;  //Роль 
      req.userId = decoded.id;      //id 
    });

    //Если запрос без body
    if(Object.keys(req.body).length === 0){
      User.findOne({
        _id: req.userId 
      })
        .exec((err, user) => {
          if (err) {
            res.status(500).send({ 
              status: 500,
              message: "Внутренняя ошибка сервера"
            });
            return;
          }
    
          //Отправка ответа
          res.status(200).send({
            status: 200,
            data: {
              id: user._id,
              login: user.login,
              role: user.role,
              password: user.password,
              department: user.department,
              name: user.name,
              surname: user.surname,
              lastname: user.lastname,
              rank: user.rank,
              image: user.image,
              notesAllow: user.notesAllow,
              last_login: user.last_login,
              login_status: user.login_status
            }
          });
        });
        return;
    }
    
    //Если запрос c body 
    if(Object.keys(req.body).length != 0){
      const searchLogin = req.body.login;

      if(!searchLogin) {  
        res.status(402).send({
          status: 402,
          message: "Ошибка! Требуемый параметр пустой!"
        });
        console.log("Ошибка! Требуемый параметр пустой!");
        return;
      }

      //Получение любого пользователя (админ)
      if (req.userRole === "admin") {  
        User.findOne({
          login: searchLogin
        })
          .exec((err, user) => {

            if (err) { 
              res.status(500).send({ 
                status: 500,
                message: "Внутренняя ошибка сервера"
              });
              return;
            }

            if (!user) {
              return res.status(404).send({ 
                status: 404,
                message: "Пользователь не найден"
              });
            }

            //Отправка ответа
            res.status(200).send({
              status: 200,
              data: {
                id: user._id,
                login: user.login,
                role: user.role,
                password: user.password,
                department: user.department,
                name: user.name,
                surname: user.surname,
                lastname: user.lastname,
                rank: user.rank,
                image: user.image,
                notesAllow: user.notesAllow,
                last_login: user.last_login,
                login_status: user.login_status
              }
            });
          });
      }
      //Получение пользователя (юзер)
      if (req.userRole === "user") {  

        User.findOne({
          _id: req.userId 
        })
          .exec((err, user) => {

            if (err) {
              res.status(500).send({ 
                status: 500,
                message: "Внутренняя ошибка сервера"
              });
              return;
            }

            if (user.login != searchLogin){
              res.status(403).send({ 
                status: 403,
                message: "Отказано в доступе"
              });
              return;
            }
            //Отправка ответа
            res.status(200).send({
              status: 200,
              data: {
                id: user._id,
                login: user.login,
                role: user.role,
                password: user.password,
                department: user.department,
                name: user.name,
                surname: user.surname,
                lastname: user.lastname,
                rank: user.rank,
                image: user.image,
                notesAllow: user.notesAllow,
                last_login: user.last_login,
                login_status: user.login_status
              }
            });
          });
      }
    }
 
  }catch(e){
    console.log(e)
    res.status(400).send({
      status: 400,
      message: "Ошибка: Вывод пользователя"
    });

  }
}

// Удаление пользователя ------------------------------
exports.deleteUser = (req, res) => {
  try {
    if(Object.keys(req.body).length === 0) {  
      res.status(402).send({
        status: 402,
        message: "Ошибка! Требуемый параметр пустой!"
      });
      console.log("Ошибка! Требуемый параметр пустой!");
      return;
    }

      console.log(req.body);
      User.findOne({
        login: req.body.login
      })
        .exec((err, user) => {
          if (err) {
            res.status(500).send({ 
              status: 500,
              message: "Внутренняя ошибка сервера"
            });
            return;
          }
    
          if (!user) {
            return res.status(404).send({ 
              status: 404,
              message: "Пользователь не найден"
            });
          }

          User.deleteOne({
            login: req.body.login
          }).exec((err, user) => {
            if (err) {
              res.status(500).send({ 
                status: 500,
                message: "Внутренняя ошибка сервера" 
              });
              return;
            }
            console.log("Пользователь удален!");
            //Отправка ответа
            res.status(200).send({
              status: 200,
              data: {
                message: "Пользователь удален!"
              }
            });
          });          
        });

  }catch(e){
    console.log(e)
    res.status(400).send({
      status: 400,
      message: "Ошибка: Удаление пользователя"
    });

  }
}

// Регистрация пользователя ---------------------------
exports.registration = (req, res) => {
  try {

    if(Object.keys(req.body).length === 0) {  
      res.status(402).send({
        status: 402,
        message: "Ошибка! Требуемый параметр пустой!"
      });
      console.log("Ошибка! Требуемый параметр пустой!");
      return;
    }



    const userLogin = req.body.login;
    const hashPassword = bcrypt.hashSync(req.body.password,8);  //Хэширование пароля
    const userRole = req.body.role;
  
    const userDepartment = req.body.department;
    const userName = req.body.name;
    const userSurname = req.body.surname;
    const userLastname = req.body.lastname;
    const userRank = req.body.rank;
    const userImage = req.body.image;
  
    const userNotesAllow = req.body.notesAllow;
    const userLast_login = req.body.last_login;
    const userLogin_status = req.body.login_status;
  
    //Проверка на пустой параметр в запросе
    if ( !userLogin || !req.body.password || !userRole) {  
      res.status(402).send({
        status: 402,
        message: "Ошибка! Требуемый параметр пустой!"
      });
      console.log("Ошибка! Требуемый параметр пустой!");
      return;
    }
  
    // Поиск регистрируемого пользователя в БД
    User.findOne({
      login: req.body.login   
    }).exec((err, user) => {
        // Login
        if (err) {
          res.status(500).send({ 
            status: 500,
            message: "Внутренняя ошибка сервера"
          });
          return;
        }
        
        //Проверка на существущиего пользователя в БД
        if (user) { 
          res.status(401).send({
            status: 401,
            message: "Ошибка! Пользователь с таким логином уже существует!"
          });
          console.log("Ошибка! Пользователь с таким логином уже существует!");
          return;
        }
  
        if(Object.keys(req.body.password).length < 8){  
          res.status(403).send({
            status: 403,
            message: "Ошибка! Пароль менее 8 символов!"
          });
          console.log("Ошибка! Пароль менее 8 символов");
          return;
        }
        
        //Создание нового пользователя
        new User({
          login: userLogin,
          password: hashPassword,
          role: userRole,
          department: userDepartment,
          name: userName,
          surname: userSurname,
          lastname: userLastname,
          rank: userRank,
          image: userImage,
          notesAllow: userNotesAllow,
          last_login: userLast_login,
          login_status: userLogin_status
        }).save(err => {
          if (err) {
            res.status(500).send({ 
              status: 500,
              message: "Внутренняя ошибка сервера"
            });
            return;
          }
  
          console.log("Пользователь успешно зарегистрирован!");
        });
  
        //Отправка ответа
        res.status(200).send({ 
          status: 200,
          data: {
            message: "Пользователь успешно зарегистрирован!" 
          }
        });
  
    });
  }catch(e){
    console.log(e)
    res.status(400).send({
      status: 400,
      message: "Ошибка: Регистрация пользователя"
    });

  }
}

// Редактирование пользователя ------------------------
exports.putUser = (req, res) => {
  try {  

    let token = req.headers["x-access-token"];
    jwt.verify(token, config.secret, (err, decoded) => {
      req.userRole = decoded.role;  //Роль 
      req.userId = decoded.id;      //id 
    });

    if(Object.keys(req.body).length === 0) {  
      res.status(402).send({
        status: 402,
        message: "Ошибка! Требуемый параметр пустой!"
      });
      console.log("Ошибка! Требуемый параметр пустой!");
      return;
    }

    const userId = req.body.id;
    const userLogin = req.body.login;
    const userRole = req.body.role;
    const userDepartment = req.body.department;
    const userName = req.body.name;
    const userSurname = req.body.surname;
    const userLastname = req.body.lastname;
    const userRank = req.body.rank;
    const userImage = req.body.image;

    //Проверка доступа (админ)
    if (req.userRole === "admin") {  

      User.findByIdAndUpdate(userId,{
        login: userLogin,
        role: userRole,
        department: userDepartment,
        name: userName,
        surname: userSurname,
        lastname: userLastname,
        rank: userRank,
        image: userImage
      }).exec((err, user) => {
        if (err) {
          res.status(500).send({ 
            status: 500,
            message: "Внутренняя ошибка сервера"
          });
          return;
        }
        console.log("Пользователь успешно изменен!(админ)");
      });
    
      //Отправка ответа
      res.status(200).send({ 
        status: 200,
        data: {
          message: "Пользователь успешно изменен (админ)!" 
        }
      });
    }
    //Проверка доступа (user)
    if (req.userRole === "user") {  
      
      User.findByIdAndUpdate(req.userId,{
        department: userDepartment,
        name: userName,
        surname: userSurname,
        lastname: userLastname,
        rank: userRank,
        image: userImage
      }).exec((err, user) => {
        if (err) {
          res.status(500).send({ 
            status: 500,
            message: "Внутренняя ошибка сервера"
          });
          return;
        }
        console.log("Пользователь успешно изменен(юзер)!");
      });
    
      //Отправка ответа
      res.status(200).send({ 
        status: 200,
        data: {
          message: "Пользователь успешно изменен(юзер)!" 
        }
      });
    }
  }catch(e){
    console.log(e)
    res.status(400).send({
      status: 400,
      message: "Ошибка: Изменение пользователя"
    });

  }
};

// Сброс пароля ---------------------------------------
exports.resetPassword = (req, res) => {
  try {
    
    if(Object.keys(req.body).length === 0) {  
      res.status(402).send({
        status: 402,
        message: "Ошибка! Требуемый параметр пустой!"
      });
      console.log("Ошибка! Требуемый параметр пустой!");
      return;
    }
  
    const userLogin = req.body.login;
  
  
    if(!userLogin){  
      res.status(402).send({
        status: 402,
        message: "Ошибка! Требуемый параметр пустой!"
      });
      console.log("Ошибка! Требуемый параметр пустой!");
      return;
    }
    console.log(userLogin); 
    var newPassword = Math.random().toString(36).slice(-8); //Создание новго рандомного пароля
    console.log('newPassword: ' + newPassword);
    var newHashPassword = bcrypt.hashSync(newPassword,8);    //Хэширование нового пароля

    User.findOneAndUpdate(
      {login: userLogin},
      {password: newHashPassword}).exec((err, user) => {
      if (err) {
        res.status(500).send({ 
          status: 500,
          message: "Внутренняя ошибка сервера"
        });
        return;
      }
  
      if (!user) {
        return res.status(404).send({ 
          status: 404,
          message: "Пользователь не найден"
        });
      }
    
      //Отправка ответа
      res.status(200).send({ 
        status: 200,
        data: {
          message: "Пароль успешно изменен админом!" //Возможно нужно отапрвить новый пароль на почту или админу в ответ
        }
      });
    });
    



  }catch(e){
    console.log(e)
    res.status(400).send({
      status: 400,
      message: "Ошибка: Сброс пароля"
    });

  }
}

// Смена пароля ---------------------------------------
exports.changePassword = (req, res) => {
  try {

    let token = req.headers["x-access-token"];
    jwt.verify(token, config.secret, (err, decoded) => {
      req.userRole = decoded.role;  //Роль 
      req.userId = decoded.id;      //id 
    });

    if((Object.keys(req.body).length === 0) || (!req.body.newpassword || !req.body.password)) {  
      res.status(402).send({
        status: 402,
        message: "Ошибка! Требуемый параметр пустой!"
      });
      console.log("Ошибка! Требуемый параметр пустой!");
      return;
    }

    if(Object.keys(req.body.newpassword).length < 8){  
      res.status(403).send({
        status: 403,
        message: "Ошибка! Новый пароль менее 8 символов!"
      });
      console.log("Ошибка! Новый пароль менее 8 символов");
      return;
    }

    //const oldHashPassword = bcrypt.hashSync(req.body.password,8);  //Хэширование пароля
    User.findOne({
      _id: req.userId
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ 
          status: 500,
          message: "Внутренняя ошибка сервера"
        });
        return;
      }      
    
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          status: 401,
          message: "Не правильный текущий пароль"
        });
      }
      
      const newHashPassword = bcrypt.hashSync(req.body.newpassword,8);  //Хэширование нового пароля
      //Запись в базу хэша нового пароля
      User.findOneAndUpdate(
        {_id: req.userId},
        {password: newHashPassword}).exec((err, user) => {
        if (err) {
          res.status(500).send({ 
            status: 500,
            message: "Внутренняя ошибка сервера"
          });
          return;
        }      
        //Отправка ответа
        res.status(200).send({ 
          status: 200,
          data: {
            message: "Пароль успешно изменен!" //Возможно нужно отапрвить новый пароль на почту или в ответ
          }
        });
      });
    });
  }catch(e){
    console.log(e)
    res.status(400).send({
      status: 400,
      message: "Ошибка: Смена пароля"
    });

  }
}