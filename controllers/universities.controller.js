const dataCheker = require("./data.checker")
const UniversitiesService = require('../services/universities.service')
const ScraperService = require('../services/scraper.service')
const EduprogramService = require('../services/eduprogram.service')

class UniversityController {

  /* [+] Получить часть университетов */
  async get(req, res) {
    let item = req.query.item

    if (item == '' || !Number.isInteger(+item) || parseInt(item) == NaN)
      return res.send({ error: true, data: 'Bad request.' })

    let result = await UniversitiesService.get(++item)
    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: 'Internal server error.' })
  }

  /* [+] Получить часть университетов */
  async getEduprograms(req, res) {
    let item = req.query.item
    let id = req.params.id

    if (item == '' || !Number.isInteger(+item) || parseInt(item) == NaN)
      return res.send({ error: true, data: 'Bad request.' })

    if (id == '' || !Number.isInteger(+id) || parseInt(id) == NaN)
      return res.send({ error: true, data: 'Bad request.' })

    let result = await EduprogramService.getUniId(id, ++item)
    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: 'Internal server error.' })
  }

  /* [+] Получить часть университетов */
  async getUniList(req, res) {
    let result = await UniversitiesService.getUniList()
    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: 'Internal server error.' })
  }

  /* [+] Добавить университет */
  async create(req, res) {
    if (req.body == '' || req.body == undefined)
      return res.send({ error: true, data: 'Bad request.' })

    if (!dataCheker.checkData("university", req.body))
      return res.send({ error: true, data: "Bad request." })

    let result = await UniversitiesService.create(req.body)
    result = result[0].id
    
    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: 'Internal server error.' })
  }

  /* [+] Изменить университет по id */
  async update(req, res) {
    let id = req.params.id

    if (id == '' || !Number.isInteger(+id) || parseInt(id) == NaN)
      return res.send({ error: true, data: 'Bad request.' })

    if (!dataCheker.checkData("university", req.body))
      return res.send({ error: true, data: "Bad request." })

    let result = await UniversitiesService.update(id, req.body)
    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: 'Internal server error.' })
  }

  /* [+] Удалить университет по id */
  async remove(req, res) {
    let id = req.params.id

    if (id == '' || !Number.isInteger(+id) || parseInt(id) == NaN)
      return res.send({ error: true, data: 'Bad request.' })

    let result = await UniversitiesService.remove(id)
    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: 'Internal server error.' })
  }

  /* [+] Обновить учебные программы университета по id */
  async refresh(req, res) {
    let result, date = ''
    let id = req.params.id

    if (id == '' || !Number.isInteger(+id) || parseInt(id) == NaN)
      return res.send({ error: true, data: 'Bad request.' })

    // Получаем идентификатор университета
    let university = await UniversitiesService.getID(id)
    // Получаем данные с сайта
    let eduProgram = await ScraperService.scraperRun(university[0].url)
    if (!eduProgram.length)
      return res.send({ error: true, data: 'Данные не получены' })
    // Удаляем предыдущие программы
    result = await EduprogramService.removeAll(university[0].id)
    // Добавляем полученные программы
    result = await EduprogramService.createAll(university[0].id, eduProgram)
    // Обновляем дату
    date = new Date()
    result = await UniversitiesService.updateDate(university[0].id, date)

    if (result)
      return res.status(200).send({ error: false, data: date })
    else
      return res.send({ error: true, data: 'Internal server error.' })
  }

  /* [+] Поиск университета по названию */
  async search(req, res) {
    let search = req.query.text

    if (search == '')
      return res.send({ error: false, data: [] })

    let result = await UniversitiesService.search(search)
    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: 'Internal server error.' })
  }

}

module.exports = new UniversityController()