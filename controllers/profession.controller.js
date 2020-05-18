const dataCheker = require("./data.checker")
const ProfessionService = require("../services/profession.service")

class ProfessionController {
  
  /* [+] Получить часть профессий */
  async get(req, res) {
    let item = req.query.item

    if (!dataCheker.checkType(+item, "number"))
      return res.send({ error: true, data: "Bad request." })

      let result = await ProfessionService.get(++item)

      if (result)
        return res.status(200).send({ error: false, data: result })
      else
        return res.send({ error: true, data: "Internal server error." })
  }

  /* [+] Добавить профессию */
  async create(req, res) {
    if (!dataCheker.checkData("profession", req.body))
      return res.send({ error: true, data: "Bad request." })
      
    let result = await ProfessionService.create(req.body)
    result = result[0].id
    
    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: "Internal server error." })
  }

  /* [+] Изменить профессию по коду */
  async update(req, res) {
    let id = req.params.id

    if (!dataCheker.checkType(+id, "number"))
      return res.send({ error: true, data: "Bad request." })

    if (!dataCheker.checkData("profession", req.body))
      return res.send({ error: true, data: "Bad request." })

    let result = await ProfessionService.update(id, req.body)
    if (result)
      return res.status(200).send({ error: false, data: req.body })
    else
      return res.send({ error: true, data: "Internal server error." })
  }

  /* [+] Удалить профессию по коду */
  async remove(req, res) {
    let id = req.params.id

    if (!dataCheker.checkType(+id, "number"))
      return res.send({ error: true, data: "Bad request." })

    let result = await ProfessionService.remove(id)
    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: "Internal server error." })
  }
  
  /* [+] Поиск профессии по названию */
  async search(req, res) {
    let search = req.query.text
    
    if (search == undefined || search == '')
      return res.send({ error: false, data: [] })

    search = search.toLowerCase()
    
    let result = await ProfessionService.search(search)
    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: "Internal server error." })
  }

}

module.exports = new ProfessionController()