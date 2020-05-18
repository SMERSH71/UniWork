const dataCheker = require("./data.checker")
const UsersService = require('../services/users.service')

class UsersController {

  /* [+] Получить список пользователей */
  async get(req, res) {
    let item = req.query.item
    let access = req.query.access
    let result = undefined

    if (item != undefined & access != undefined) {
      if (access == "true") {
        result = await UsersService.getUserRequest(++item)
      } else {
        result = await UsersService.get(++item)
      }
    }
    else {
      return res.send({ error: true, data: 'Bad request.' })
    }

    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: 'Internal server error.' })
  }

  /* [+] Получить количество заявок */
  async getRequestCount(req, res) {
    let result = await UsersService.getRequestCount()

    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: 'Internal server error.' })
  }

  /* [+] Изменить роль пользователю */
  async setRole(req, res) {
    let login = req.params.login

    if (!dataCheker.checkType(login, "string"))
      return res.send({ error: true, data: 'Bad request.' })

    if (!dataCheker.checkData("user", req.body))
      return res.send({ error: true, data: 'Bad request.' })

    let data = req.body
    let result = await UsersService.setRole(login, data.role, data.university)

    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: 'Internal server error.' })
  }

  /* [+] Изменить роль пользователю */
  async removeRequest(req, res) {
    let login = req.params.login

    if (!dataCheker.checkType(login, "string"))
      return res.send({ error: true, data: 'Bad request.' })

    let result = await UsersService.removeRequest(login)

    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: 'Internal server error.' })
  }

  /* [+] Поиск пользователей */
  async search(req, res) {
    let search = req.query.text

    if (search == undefined || search == '')
      return res.send({ error: false, data: [] })

    search = search.toLowerCase()

    let result = await UsersService.search(search)

    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: 'Internal server error.' })
  }

}

module.exports = new UsersController()