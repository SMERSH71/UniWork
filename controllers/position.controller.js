const PositionService = require('../services/position.service')

class PositionController {
  
  /* [+] Получить часть профессий */
  async get(req, res) {
    let item = req.query.item
    
    if (item == '' || !Number.isInteger(+item) || parseInt(item) == NaN)
      return res.send({ error: true, data: 'Bad request.' })

      let result = await PositionService.get(++item)

      if (result)
        return res.status(200).send({ error: false, data: result })
      else
        return res.send({ error: true, data: 'Internal server error.' })
  }

  /* [+] Добавить профессию */
  async create(req, res) {
    if (!dataCheker.checkData("position", req.body))
      return res.send({ error: true, data: "Bad request." })
    
    let result = await PositionService.create(req.body)
    result = result[0].id
    
    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: 'Internal server error.' })
  }

  /* [+] Изменить профессию по коду */
  async update(req, res) {
    let id = req.params.id

    if (!dataCheker.checkType(+id, "number"))
      return res.send({ error: true, data: "Bad request." })

    if (!dataCheker.checkData("position", req.body))
      return res.send({ error: true, data: "Bad request." })

    let result = await PositionService.update(id, req.body)
    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: 'Internal server error.' })
  }

  /* [+] Удалить профессию по коду */
  async remove(req, res) {
    let id = req.params.id

    if (!dataCheker.checkType(+id, "number"))
      return res.send({ error: true, data: "Bad request." })

    let result = await PositionService.remove(id)
    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: 'Internal server error.' })
  }
  
  /* [+] Поиск профессии по названию */
  async search(req, res) {
    let search = req.query.text

    if (search == '')
      return res.send({ error: false, data: [] })

    let result = await PositionService.search(search)
    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: 'Internal server error.' })
  }

}

module.exports = new PositionController()