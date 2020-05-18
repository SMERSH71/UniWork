const UniversityService = require('../services/eduprogram.service')

class ScraperController {
  /* [+] Получить список учебных программ университета */
  async scraperRuner(req, res){
    let result = await UniversityService.GetAll();
    if (result)
      return res.status(200).send({ error: false, data: result });
    else
      return res.send({ error: true, data: 'Internal server error.' });
  }
  
  scraperRun(){
    console.log("scraperRun");
  }

  /* [+] Обновить учебные программы университета по id */
  async universityRefresh(req, res) {
    let id = req.params.id;
    if (id == '' || !Number.isInteger(+id) || parseInt(id) == NaN)
      return res.send({ error: true, data: 'Bad request.' });
    
    let result = await this.scraperRun()//UniversityService.universityRefresh(id);
    if (result)
      return res.status(200).send({ error: false, data: result });
    else
      return res.send({ error: true, data: 'Internal server error.' });
  }
}

module.exports = new ScraperController();