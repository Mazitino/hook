const { authJwt } = require("../services/authJwt");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  let objectURL = "/api/user";

  app.get(objectURL,[verifyToken],controller.getUser);                          // Получить пользователя
  app.put(objectURL,[verifyToken],controller.putUser);                          // Редактирование пользователя
  app.post(objectURL,[verifyToken, isAdmin], controller.registration);          // Регистрация пользователя (админ)
  app.delete(objectURL,[verifyToken, isAdmin],controller.deleteUser);           // Удаление пользователя (админ)
  app.get("/api/users",[verifyToken, isAdmin],controller.getUsers);             // Получить всех пользователей с пагинацией (админ)
  app.put("/api/user/resetpass",[verifyToken, isAdmin],controller.resetPassword);        // Сброс пароля (админ)
  app.put("/api/user/changepass",[verifyToken],controller.changePassword);       // Смена пароля
};