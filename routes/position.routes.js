const express = require('express')
const positionRouter = express.Router()

const PositionController = require('../controllers/position.controller')
  
positionRouter
  /* [+] Получить список должностей */
  .get('/', PositionController.get)
  /* [+] Добавить должность */
  .post('/', PositionController.create)
  /* [+] Изменить должность по коду */
  .put('/:id', PositionController.update)
  /* [+] Удалить должность по коду */
  .delete('/:id', PositionController.remove)
  /* [+] Поиск должностей */
  .get('/search', PositionController.search)

module.exports = positionRouter