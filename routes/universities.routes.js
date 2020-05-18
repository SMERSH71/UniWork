const express = require("express")
const universitiesRouter = express.Router()

const UniversitiesController = require("../controllers/universities.controller")
  universitiesRouter
  /* [+] Получить часть университетов */
  .get("/", UniversitiesController.get)
  /* [+] Получить часть университетов */
  .get("/:id/eduprograms", UniversitiesController.getEduprograms)
  /* [+] Получить часть университетов */
  .get("/list", UniversitiesController.getUniList)
  /* [+] Добавить университет */
  .post("/", UniversitiesController.create)
  /* [+] Изменить университет по id */
  .put("/:id", UniversitiesController.update)
  /* [+] Удалить университет по id */
  .delete("/:id", UniversitiesController.remove)
  /* [+] Обновить учебные программы университета по id */
  .get("/refresh/:id", UniversitiesController.refresh)
  /* [+] Поиск университетов */
  .get("/search", UniversitiesController.search)

module.exports = universitiesRouter