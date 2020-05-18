const request = require('request')
class ScraperService {

  async scraperRun(url) {
    var data = await this.getPage(url)
    let result = await this.parsePage(data)
    //console.log(result)
    return result
    /*//(\w*|[а-яА-ЯёЁ]*|.*[^ ]*)\w|[а-яА-ЯёЁ])*\/[^>]+
    let results = data.matchAll(/<a.*href="(?<href>(\w|[а-яА-ЯёЁ])*\/[^>]+)">(?<text>.+?)<\/a>/gim);
    var RegExp = /лдл/i;
    for (let result of results) {
      if(result.groups.text == "Образование")
      console.log(result.groups.text+" - "+result.groups.href);
    }*/
  }

  getPage(url) {
    return new Promise((res, rej) => {
      request(url, (err, response, body) => {
        if (err) return res(err)
        return res(body)
      })
    })
  }

  parsePage(data) {
    let eduList = [], edu = {}
    let results = data.matchAll(/<tr.*>(?<str>[\s\S]*?)<\/tr>/gim)
    for (let result of results) {
      let str = result.groups.str
      str = str.replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').replace(/>\s*/g, '>').replace(/\s*</g, '<').replace(/></g, '>\r\n<'); + '\r\n'
      edu.eduCode = str.match(/<.*?itemprop="eduCode".*?>\s*(?<eduCode>[\s\S]*?)\s*<\/.*>[.\s]*/im)
      edu.eduName = str.match(/<.*?itemprop="eduName".*?>\s*(?<eduName>[\s\S]*?)\s*<\/.*>[.\s]*/im)
      edu.eduLevel = str.match(/<.*?itemprop="eduLevel".*?>\s*(?<eduLevel>[\s\S]*?)\s*<\/.*>[.\s]*/im)
      edu.eduForm = str.match(/<.*?itemprop="eduForm".*?>\s*(?<eduForm>[\s\S]*?)\s*<\/td>[.\s]*/gim)
      edu.learningTerm = str.match(/<.*?itemprop="learningTerm".*?>\s*(?<learningTerm>[\s\S]*?)\s*<\/td>[.\s]*/gim)
      edu.dateEnd = str.match(/<.*?itemprop="dateEnd".*?>\s*(?<dateEnd>[\s\S]*?)\s*<\/.*>[.\s]*/im)
      edu.language = str.match(/<.*?itemprop="language".*?>\s*(?<language>[\s\S]*?)\s*<\/.*>[.\s]*/im)
      if (edu.eduCode != null && edu.eduName != null && edu.eduLevel != null && edu.language != null) {
        let _res = `${(edu.eduCode != null ? edu.eduCode.groups.eduCode : '')} @ 
          ${(edu.eduName != null ? edu.eduName.groups.eduName : '')} @
          ${(edu.eduLevel != null ? edu.eduLevel.groups.eduLevel : '')} @
           @
          ${(edu.learningTerm != null ? edu.learningTerm.join(' ') : '')} @
          ${(edu.dateEnd != null ? edu.dateEnd.groups.dateEnd : '')} @
          ${(edu.language != null ? edu.language.groups.language : '')}`;
        //${(edu.eduForm != null ? edu.eduForm.groups.eduForm : '')} @
        let s = _res.replace(/<[\s\S]*?>/g, '').replace(/\s+|&nbsp;/g, ' ')
        let p = s.split("@")
        eduList.push(
          {
            eduCode: p[0].trim(),
            eduName: p[1].trim(),
            eduLevel: p[2].trim(),
            eduForm: p[3].trim(),
            learningTerm: p[4].trim(),
            dateEnd: p[5].trim(),
            language: p[6].trim()
          }
        )
      }
    }
    return eduList
  }

}
module.exports = new ScraperService();