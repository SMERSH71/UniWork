const db = require("./db")
const tableName = "universities"//---!!!---

class UniversityService {

  /* [+] Получить университет */
  get(uid) {
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

  /* [+] Изменить университет*/
  update(uid, data) {
    return new Promise((res, rej) => {
      db.query("update " + tableName + " set full_name = $2, short_name = $3, url = $4 where id = (select university from users where uid = $1)", 
      [uid, data.full_name, data.short_name, data.url], 
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