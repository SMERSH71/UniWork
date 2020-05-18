const dataCheker = require("./data.checker")
const EduprogramService = require("../services/eduprogram.service")

class EduprogramController {

  /* [+] Получить часть учебных программ */
  async get(req, res) {
    let item = req.query.item

    if (!dataCheker.checkType(+item, "number"))
      return res.send({ error: true, data: "Bad request." })
    let result

    if (req.session.uid) {
      result = await EduprogramService.getForEmpUni(req.session.uid, ++item)
    }
    else {
      result = await EduprogramService.get(++item)
    }
    
    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: "Internal server error." })
  }

  /* [+] Добавить учебную программу */
  async create(req, res) {
    if (!dataCheker.checkData("eduprogram", req.body))
      return res.send({ error: true, data: "Bad request." })
      
    let result
    if (req.session.uid) {
      result = await EduprogramService.create(req.session.uid, req.body)
    }
    result = result[0].id
    
    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: "Internal server error." })
  }

  /* [+] Изменить учебную программу по id */
  async update(req, res) {
    let id = req.params.id

    if (!dataCheker.checkType(+id, "number"))
      return res.send({ error: true, data: "Bad request." })

    if (!dataCheker.checkData("eduprogram", req.body))
      return res.send({ error: true, data: "Bad request." })

    let result = await EduprogramService.update(id, req.body)
    if (result)
      return res.status(200).send({ error: false, data: req.body })
    else
      return res.send({ error: true, data: "Internal server error." })
  }

  /* [+] Удалить учебную программу по id */
  async remove(req, res) {
    let id = req.params.id

    if (!dataCheker.checkType(+id, "number"))
      return res.send({ error: true, data: "Bad request." })

    let result = await EduprogramService.remove(id)
    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: "Internal server error." })
  }

  /* [+] Поиск учебной программы по названию */
  async search(req, res) {
    let search = req.query.text

    if (search == undefined || search == '')
      return res.send({ error: false, data: [] })

    search = search.toLowerCase()
    let result
    if (req.query.university){
      if (!dataCheker.checkType(+req.query.university, "number"))
        return res.send({ error: true, data: "Bad request." })
      result = await EduprogramService.searchUni(search, req.query.university)
    }
    else
      result = await EduprogramService.search(search)
    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: "Internal server error." })
  }

}

module.exports = new EduprogramController()