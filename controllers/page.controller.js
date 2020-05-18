const UserService = require("../services/user.service")
let path = __dirname
path = path.split('\\')
path.pop()
path = path.join('\\')

class PageController {

  async pager(req, res) {
    console.log(req.session.uid)
    if(req.session.uid){
      let result = await UserService.get(req.session.uid)
      switch (result[0].role) {
        case 0: return res.sendFile(path + '/private/index.html');
        case 1: return res.sendFile(path + '/private/admin.html');
        case 2: return res.sendFile(path + '/private/empuni.html');
        case 3: return res.sendFile(path + '/private/empjob.html');
        case 4: return res.sendFile(path + '/private/empcompany.html');
      
        default: return res.sendFile(path + '/private/index.html')
      }
    }
    return res.sendFile(path + '/private/index.html')
  }

  /* [+] Страница входа */
  startPage(req, res) {
    return res.sendFile(path + '/private/index.html')
  }
  /* [+] Страница администратора */
  adminPage(req, res) {
    return res.sendFile(path + '/private/admin.html')
  }
  /* [+] Страница работника университета */
  uniPage(req, res) {
    return res.sendFile(path + '/private/empuni.html')
  }
  /* [+] Страница работника ЦЗН */
  jobPage(req, res) {
    return res.sendFile(path + '/private/empjob.html')
  }
  /* [+] Страница работодателя */
  companyPage(req, res) {
    return res.sendFile(path + '/private/empcompany.html')
  }

}

module.exports = new PageController()