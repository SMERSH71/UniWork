const dataCheker = require("./data.checker")
const AuthService = require("../services/auth.service")

function getPageRole(role) {
  let path = ""
  switch (role) {
    case 1:
      path = "/admin"
      break;
    case 2:
      path = "/empuni"
      break;
    case 3:
      path = "/empjob"
      break;
    case 4:
      path = "/empcompany"
      break;

    default:
      path = "//"
      break;
  }
  return path.slice(1)
}

class AuthController {

  /* [+] Проверка доступа */
  async authChecker(req, res, next) {
    let result, path = '/'
    if(req.path == '/login' || req.path == '/logout') return next()
    if (req.session.uid){
      result = await AuthService.authSession(req.session.uid)
      if (result.length){
        if (req.path.indexOf('api') >= 0) return next()
        path = getPageRole(result[0].role)
      }
      else{
        path = '/'
      }
    }
    else{
      if (req.path.indexOf('api') >= 0) return res.send({ error: true, data: 'Unauthorized.' })
      path = '/'
    }
    if(req.path.indexOf(path) >= 1 || req.path == path) return next()
    res.redirect(path)
  }

  /* [+] Авторизовать пользователя */
  async login(req, res) {
    let result = await AuthService.login(req.body.login, req.body.password)
    
    if (result.length) {
      req.session.uid = Date.now()
      AuthService.setSessionID(req.body.login, req.session.uid)
      res.status(200).send({ error: false, data: getPageRole(result[0].role) })//this.getPageRole(result[0].role) })
    }
    else
      return res.send({ error: true, data: "Internal server error." })
  }

  /* [+] Авторизовать пользователя */
  async logout(req, res) {
      AuthService.delSessionID(req.session.uid)
      req.session.destroy(req.session.id)
      res.clearCookie('connect.sid', {path: '/'})
      //res.redirect('/')
      res.status(200).send({ error: false, data: null })
      console.log("out")
  }

  /* [+] Получить часть профессий */
  async setSessionID(req, res) {
    let result = await AuthService.setSessionID(req.body.login, req.sessionID)

    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: "Internal server error." })
  }

}

module.exports = new AuthController()