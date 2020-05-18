const db = require("./db")
const tableName = "positions"
const limit = 10

class PositionsService {

  /* [+] Получить список должностей */
  get(item) {
    return new Promise((res, rej) => {
      db.query("select * from " + tableName + " order by name limit $1", 
      [item * limit], 
      (err, result) => {
        if (err)
          return res(false)

        return res(result.rows.slice(-limit))
      })
    })
  }

  /* [+] Добавить должность */
  create(data) {
    return new Promise((res, rej) => {
      db.query("insert into " + tableName + "(kod, kch, name, tarif, etkc, okz) values ($1, $2, $3, $4, $5, $6) returning id", 
      [data.kod, data.kch, data.name, data.tarif, data.etkc, data.okz], 
      (err, result) => {
        if (err)
          return res(false)

        return res(result.rows[0].id)
      })
    })
  }

  /* [+] Изменить должность по коду */
  update(id, data) {
    return new Promise((res, rej) => {
      db.query("update " + tableName + " set kod = $2, kch = $3, name = $4, tarif = $5, etkc = $6, okz = $7 where kod = $1", 
      [id, data.kod, data.kch, data.name, data.tarif, data.etkc, data.okz], 
      (err, result) => {
        if (err)
          return res(false)

        return res(result.rows)
      })
    })
  }

  /* [+] Удалить должность по коду */
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

  /* [+] Поиск должности по названию */
  search(search) {
    return new Promise((res, rej) => {
      db.query("select * from " + tableName + " where lower(name) like $1 || '%'", 
      [search], 
      (err, result) => {
        if (err)
          return res(false)
        return res(result.rows)
      })
    })
  }

}

module.exports = new PositionsService()