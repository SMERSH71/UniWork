const dataCheker = require("./data.checker")
const UserService = require("../services/user.service")

class UserController {

  /* [+] Получить данные пользователя */
  async get(req, res) {
    let result
    if (req.session.uid) {
      result = await UserService.get(req.session.uid)
    }
    else {
      return res.send({ error: true, data: "Bad request." })
    }

    if (result) {
      result = result[0]
      delete result.password
      delete result.uid
      delete result.role
      delete result.university

      return res.status(200).send({ error: false, data: result })
    }
    else
      return res.send({ error: true, data: "Internal server error." })
  }

  /* [+] Добавить пользователя */
  async create(req, res) {
    if (!dataCheker.checkData("user", req.body))
      return res.send({ error: true, data: "Bad request." })

    let result = await UserService.create(req.body)
    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: "Internal server error." })
  }

  /* [-] Изменить пользователя по uid */
  async update(req, res) {
    if (!dataCheker.checkData("user", req.body))
      return res.send({ error: true, data: "Bad request." })

    let result
    if (req.session.uid) {
      result = await UserService.update(req.session.uid, req.body)
      if(req.body.oldpassword && req.body.newpassword)
        result = await UserService.updatePassword(req.session.uid, req.body)
    }
    else {
      return res.send({ error: true, data: "Bad request." })
    }

    if (result)
      return res.status(200).send({ error: false, data: req.body })
    else
      return res.send({ error: true, data: "Internal server error." })
  }

  /* [-] Удалить пользователя по uid */
  async remove(req, res) {
    let kod = req.params.kod

    if (!dataCheker.checkType(+kod, "number"))
      return res.send({ error: true, data: "Bad request." })

    let result = await UserService.remove(kod)
    if (result)
      return res.status(200).send({ error: false, data: result })
    else
      return res.send({ error: true, data: "Internal server error." })
  }

}

module.exports = new UserController()