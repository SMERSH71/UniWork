const express = require("express")
const usersRouter = express.Router()

const UsersController = require("../controllers/users.controller")
  usersRouter
  /* [+] Получить список пользователей */
  .get("/", UsersController.get)
  /* [+] Получить список пользователей */
  .get("/request", UsersController.getRequestCount)
  /* [+] Изменить роль пользователя */
  .put("/:login", UsersController.setRole)
  /* [+] Изменить роль пользователя */
  .delete("/:login", UsersController.removeRequest)
  /* [+] Поиск пользователей */
  .get("/search", UsersController.search)

module.exports = usersRouter