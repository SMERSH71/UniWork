const express = require('express')
const eduprogramRouter = express.Router()

const EduprogramController = require('../controllers/eduprogram.controller')
  
eduprogramRouter
  /* [+] Получить список учебных программ */
  .get('/', EduprogramController.get)
  /* [+] Добавить учебную программу */
  .post('/', EduprogramController.create)
  /* [+] Изменить учебную программу по id */
  .put('/:id', EduprogramController.update)
  /* [+] Удалить учебную программу по id */
  .delete('/:id', EduprogramController.remove)
  /* [+] Поиск учебной программы */
  .get('/search', EduprogramController.search)

module.exports = eduprogramRouter