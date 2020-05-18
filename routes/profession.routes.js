const express = require('express')
const professionRouter = express.Router()

const ProfessionController = require('../controllers/profession.controller')
  
professionRouter
  /* [+] Получить список профессий */
  .get('/', ProfessionController.get)
  /* [+] Добавить профессию */
  .post('/', ProfessionController.create)
  /* [+] Изменить профессию по коду */
  .put('/:id', ProfessionController.update)
  /* [+] Удалить профессию по коду */
  .delete('/:id', ProfessionController.remove)
  /* [+] Поиск профессий */
  .get('/search', ProfessionController.search)

module.exports = professionRouter