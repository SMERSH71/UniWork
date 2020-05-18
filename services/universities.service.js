const db = require("./db")
const tableName = "universities"//---!!!---
const limit = 10

class UniversityService {

  /* [+] Получить часть университетов */
  get(item) {
    return new Promise((res, rej) => {
      db.query("select * from " + tableName + " order by full_name limit $1",
        [item * limit],
        (err, result) => {
          if (err)
            return res(false)

          return res(result.rows.slice(-limit))
        })
    })
  }

  /* [+] Получить часть университетов */
  getUniList() {
    return new Promise((res, rej) => {
      db.query("select id, full_name from " + tableName + " order by full_name",
        [],
        (err, result) => {
          if (err)
            return res(false)

          return res(result.rows.slice(-limit))
        })
    })
  }

  /* [+] Получить университет по id */
  getID(id) {
    return new Promise((res, rej) => {
      db.query("select * from " + tableName + " where id = $1",
        [id],
        (err, result) => {
          if (err)
            return res(false)

          return res(result.rows)
        })
    })
  }

  /* [+] Получить университет по id */
  getForUni(uid) {
    return new Promise((res, rej) => {
      db.query("select * from " + tableName + " where id = (select university from users where uid = $1)",
        [uid],
        (err, result) => {
          if (err)
            return res(false)

          return res(result.rows)
        })
    })
  }

  /* [+] Добавить университет */
  create(data) {
    return new Promise((res, rej) => {
      db.query("insert into " + tableName + " (full_name, short_name, url) values ($1, $2, $3) returning id",
        [data.full_name, data.short_name, data.url],
        (err, result) => {
          if (err)
            return res(false)

          return res(result.rows[0].id)
        })
    })
  }

  /* [+] Изменить университет по id */
  update(id, data) {
    return new Promise((res, rej) => {
      db.query("update " + tableName + " set full_name = $1, short_name = $2, url = $3 where id = $4",
        [data.full_name, data.short_name, data.url, id],
        (err, result) => {
          if (err)
            return res(false)

          return res(result.rows)
        })
    })
  }

  /* [+] Удалить университет по id */
  remove(id) {
    return new Promise((res, rej) => {
      db.query("delete from " + tableName + " where id = $1",
        [id],
        (err, result) => {
          if (err)
            return res(false)

          return res(result.rows)
        })
    })
  }

  /* [+] Обновить учебные программы университета по id */
  refresh(id, date) {
    return new Promise((res, rej) => {
      return res("-")
      db.query("update " + tableName + " set 'last_update' = $1 where id = $2", [date, id], (err, result) => {
        if (err)
          return res(false)

        return res(result.rows)
      })
    })
  }

  /* [+] Поиск университета по названию */
  search(search) {
    return new Promise((res, rej) => {
      db.query("select * from " + tableName + " where lower(full_name) like $1 || '%'",
        [search],
        (err, result) => {
          if (err)
            return res(false)
          return res(result.rows)
        })
    })
  }

  /* [+] Получить университет */
  updateDate(id, date) {
    return new Promise((res, rej) => {
      db.query("update " + tableName + " set last_update = $2 where id = $1",
        [id, date],
        (err, result) => {
          if (err)
            return res(false)

          return res(result.rows)
        })
    })
  }

}

module.exports = new UniversityService()