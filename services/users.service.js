const db = require("./db")
const tableName = "users"
const limit = 10;

class UsersService {

  /* [+] Получить часть списка пользователей */
  get(item) {
    return new Promise((res, rej) => {
      db.query("select users.name, users.surname, users.patronymic, users.organization, users.position, users.role, users.university, users.login, universities.full_name from users left join universities on users.university = universities.id where users.role <> 0 order by users.surname limit $1",
        [item * limit],
        (err, result) => {
          if (err) return res(false)
          return res(result.rows.slice(-limit))
        })
    })
  }

  /* [+] Получить часть списка заявок пользователей */
  getUserRequest(item) {
    return new Promise((res, rej) => {
      db.query("select * from " + tableName + " where role = 0 order by surname limit $1",
        [item * limit],
        (err, result) => {
          if (err) return res(false)
          return res(result.rows.slice(-limit))
        })
    })
  }

  /* [+] Получить часть списка заявок пользователей */
  getRequestCount() {
    return new Promise((res, rej) => {
      db.query("select count(*) from " + tableName + " where role = 0",
        [],
        (err, result) => {
          if (err) return res(false)
          return res(result.rows[0].count)
        })
    })
  }

  /* [+] Установить роль пользователю */
  setRole(login, role) {
    return new Promise((res, rej) => {
      db.query("update " + tableName + " set role = $2 where login = $1",
        [login, role],
        (err, result) => {
          if (err) return res(false)
          return res(result.rows)
        })
    })
  }  
  
  /* [+] Установить роль и университет пользователю */
  setRole(login, role, university) {
    return new Promise((res, rej) => {
      db.query("update " + tableName + " set role = $2, university = $3 where login = $1",
        [login, role, university],
        (err, result) => {
          if (err) return res(false)
          return res(result.rows)
        })
    })
  }

  /* [+] Удалить заявку пользователя */
  removeRequest(login) {
    return new Promise((res, rej) => {
      db.query("delete from " + tableName + " where login = $1",
        [login],
        (err, result) => {
          if (err) return res(false)
          return res(result.rows)
        })
    })
  }

  /* [+] Поиск пользователя */
  search(search) {
    return new Promise((res, rej) => {
      db.query("select * from " + tableName + " where lower(surname) like $1 || '%'",
        [search],
        (err, result) => {
          if (err) return res(false)
          return res(result.rows)
        })
    })
  }

}

module.exports = new UsersService()