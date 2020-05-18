const db = require("./db")
const tableName = 'configurations'

  let ulist = [{
    id: 1,
    login: '123123',
    password: '123311',
    name: 'Нина',
    surname: 'Орлова',
    patronymic: 'Степановна',
    organization: 'Lpax',
    position: 'sosatelnica',
    role: 'czn'
  },
  {
    id: 2,
    login: '12dasas',
    password: 'dfasddf',
    name: 'Анна',
    surname: 'Чехова',
    patronymic: 'Григорьевна',
    organization: 'LSTU',
    position: 'secretar',
    role: 'univ'
  },
  {
    id: 3,
    login: ';ljljddfd',
    password: 'oierwejf',
    name: 'Максим',
    surname: 'Берило',
    patronymic: 'Николаевич',
    organization: 'GTM',
    position: 'ingener',
    role: 'admin'
  },
  {
    id: 4,
    login: '12dasas',
    password: 'dfasddf',
    name: 'Ксения',
    surname: 'Чеховская',
    patronymic: 'Анатольевна',
    organization: 'LSTU',
    position: 'secretar',
    role: 'univ'
  }]
class СonfigurationService {
  /* [-] Получить список должностей */
  getAll() {
    return new Promise((res, rej) => {
      return res(ulist);

      db.query('select * from ' + tableName, [], (err, result) => {
        if (err)
          return res(false)

        return res(result.rows)
      })
    })
  }
  /* [-] Получить должность по id */
  get(id) {
    return new Promise((res, rej) => {
      db.query('select * from ' + tableName + ' where "id" = $1', [id], (err, result) => {
        if (err)
          return res(false)

        return res(result.rows)
      })
    })
  }
  /* [-] Добавить должность */
  create(data) {
    return new Promise((res, rej) => {
      db.query('insert into ' + tableName + ' ("fullName", "shortName", "url") values ($1,$2,$3) returning id', [data.fullName, data.shortName, data.url], (err, result) => {
        if (err)
          return res(false)

        return res(result.rows[0].id)
      })
    })
  }
  /* [-] Изменить должность по id */
  update(id, data) {
    return new Promise((res, rej) => {
      db.query('update ' + tableName + ' set "fullName" = $1, "shortName" = $2, "url" = $3 where id = $4', [data.fullName, data.shortName, data.url, id], (err, result) => {
        if (err)
          return res(false)

        return res(result.rows)
      })
    })
  }
  /* [+] Удалить должность по id */
  remove(id) {
    return new Promise((res, rej) => {
      db.query('delete from ' + tableName + ' where "id" = $1', [id], (err, result) => {
        if (err)
          return res(false)

        return res(result.rows)
      })
    })
  }
}

module.exports = new СonfigurationService()