const express = require("express")
const universityRouter = express.Router()

const UniversityController = require("../controllers/university.controller")
  universityRouter
  /* [+] Получить университет */
  .get("/", UniversityController.get)
  /* [+] Изменить университет */
  .put("/", UniversityController.update)
  /* [+] Обновить учебные программы университета по id */
  .get("/refresh", UniversityController.refresh)

module.exports = universityRouter