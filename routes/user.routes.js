const express = require("express")
const userRouter = express.Router()

const UserController = require("../controllers/user.controller")
  userRouter
  /* [+] Получить список пользователей */
  .get("/", UserController.get)
  /* [+] Добавить пользователя */
  .post("/", UserController.create)
  /* [+] Изменить пользователя */
  .put("/", UserController.update)
  /* [+] Удалить пользователя по логину */
  .delete("/:id", UserController.remove)

module.exports = userRouter