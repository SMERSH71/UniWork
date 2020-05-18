const dataCheker = require("./data.checker")
const UniversityService = require('../services/university.service')
const ScraperService = require('../services/scraper.service')
const EduprogramService = require('../services/eduprogram.service')

class UniversityController {

  /* [+] Получить университет */
  async get(req, res) {
    let result
    if (req.session.uid) {
      result = await UniversityService.get(req.session.uid)
    } else {
      return res.send({ error: true, data: 'Bad request.' })
    }

    if (result)
      return res.status(200).send({ error: false, data: result[0] })
    else
      return res.send({ error: true, data: 'Internal server error.' })
  }

  /* [+] Изменить университет */
  async update(req, res) {
    if (!dataCheker.checkData("university", req.body))
      return res.send({ error: true, data: "Bad request." })
    
    let result
    if (req.session.uid) {
      result = await UniversityService.update(req.session.uid, req.body)
    } else {
      return res.send({ error: true, data: 'Bad request.' })
    }
    
    if (result)
      return res.status(200).send({ error: false, data: req.body })
    else
      return res.send({ error: true, data: 'Internal server error.' })
  }

  /* [+] Обновить учебные программы университета по id */
  async refresh(req, res) {
    let result, date = ''
    if (req.session.uid) {
      let university = await UniversityService.get(req.session.uid)
      // Получаем данные с сайта
      let eduProgram = await ScraperService.scraperRun(university[0].url)
      if (!eduProgram.length)
        return res.send({ error: true, data: 'Данные не получены' })
      // Удаляем предыдущие программы
      result = await EduprogramService.removeAll(university[0].id)
      // Добавляем полученные программы
      result = await EduprogramService.createAll(university[0].id, eduProgram)
      // Обновляем дату
      date = new Date()//.toLocaleString('ru-RU', { dateStyle: 'short' }).split('-').reverse().join('.')
      result = await UniversityService.updateDate(university[0].id, date)
    } 
    else {
      return res.send({ error: true, data: 'Bad request.' })
    }

    if (result)
      return res.status(200).send({ error: false, data: date })
    else
      return res.send({ error: true, data: 'Internal server error.' })
  }

}

module.exports = new UniversityController()