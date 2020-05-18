const db = require("./db")
const tableName = "users"

class UserService {

  /* [+] Получить даные пользователя */
  get(uid) {
    return new Promise((res, rej) => {
      db.query("select * from " + tableName + " where uid = $1", 
      [uid], 
      (err, result) => {
        if (err)
          return res(false)

        return res(result.rows)
      })
    })
  }

  /* [+] Добавить пользователя */
  create(data) {
    return new Promise((res, rej) => {
      db.query("insert into " + tableName + "(name, surname, patronymic, organization, position, login, password) values ($1,$2,$3,$4,$5,$6,$7)", 
      [data.name, data.surname, data.patronymic, data.organization, data.position, data.login, data.password], 
      (err, result) => {
        if (err)
          return res(false)

        return res(result.rows)
      })
    })
  }

  /* [+] Изменить данные пользователя */
  update(uid, data) {
    return new Promise((res, rej) => {
      db.query("update " + tableName + " set name = $2, surname = $3, patronymic = $4, organization = $5, position = $6 where uid = $1", 
      [uid, data.name, data.surname, data.patronymic, data.organization, data.position], 
      (err, result) => {
        if (err)
          return res(false)

        return res(result.rows)
      })
    })
  }

  /* [+] Изменить данные пользователя */
  updatePassword(uid, data) {
    return new Promise((res, rej) => {
      db.query("update " + tableName + " set password = $3 where uid = $1 and password = $2", 
      [uid, data.oldpassword, data.newpassword], 
      (err, result) => {
        if (err)
          return res(false)

        return res(result.rows)
      })
    })
  }

  /* [+] Удалить пользователя */
  remove(kod) {
    return new Promise((res, rej) => {
      db.query("delete from " + tableName + " where login = $1", 
      [kod], 
      (err, result) => {
        if (err)
          return res(false)

        return res(result.rows)
      })
    })
  }

  /* [+] Поиск профессии по названию */
  search(search) {
    return new Promise((res, rej) => {
      db.query("select * from " + tableName + " where lower(surname) like $1 || '%'", 
      [search], 
      (err, result) => {
        if (err)
          return res(false)
        return res(result.rows)
      })
    })
  }

}

module.exports = new UserService()