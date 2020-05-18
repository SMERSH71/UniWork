const db = require("./db")
const tableName = "eduprograms"
const limit = 10

class EduprogramService {

  /* [+] Получить список учебных программ (Добавить получение университета)*/
  get(item) {
    return new Promise((res, rej) => {
      db.query("select * from " + tableName + " order by level, name limit $1",
        [item * limit],
        (err, result) => {
          if (err)
            return res(false)

          return res(result.rows.slice(-limit))
        })
    })
  }

  /* [+] Получить список учебных программ университета */
  getUniId(id, item) {
    return new Promise((res, rej) => {
      db.query("select * from " + tableName + " where id_university = $2 order by level, name limit $1",
        [item * limit, id],
        (err, result) => {
          if (err)
            return res(false)

          return res(result.rows.slice(-limit))
        })
    })
  }

  /* [+] Получить список учебных программ для работника университета */
  getForEmpUni(uid, item) {
    return new Promise((res, rej) => {
      db.query("select * from " + tableName + " where id_university = (select university from users where uid = $2) order by level, name limit $1",
        [item * limit, uid],
        (err, result) => {
          if (err)
            return res(false)

          return res(result.rows.slice(-limit))
        })
    })
  }

  /* [+] Добавить учебную программу */
  create(uid, data) {
    return new Promise((res, rej) => {
      db.query("insert into " + tableName + "(id_university, code, name, level, date_end, language, students) values ((select university from users where uid = $1),$2,$3,$4,$5,$6) returning id",
        [uid, data.code, data.name, data.level, data.date_end, data.language, data.students],
        (err, result) => {
          if (err)
            return res(false)

          return res(result.rows)
        })
    })
  }

  /* [+] Изменить учебную программу по id */
  update(id, data) {
    return new Promise((res, rej) => {
      db.query("update " + tableName + " set code = $2, name = $3, level = $4, date_end = $5, language = $6, students=$7 where id = $1",
        [id, data.code, data.name, data.level, data.date_end, data.language, data.students],
        (err, result) => {
          if (err)
            return res(false)

          return res(result.rows)
        })
    })
  }

  /* [+] Удалить учебную программу по id */
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

  /* [+] Поиск учебной программы по названию */
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

  /* [+] Поиск учебной программы по названию и id университета */
  searchUni(search, id) {
    return new Promise((res, rej) => {
      db.query("select * from " + tableName + " where lower(name) like $1 || '%' and id_university = $2",
        [search, id],
        (err, result) => {
          if (err)
            return res(false)
          return res(result.rows)
        })
    })
  }

  /* [+] Добавить учебные программы */
  createAll(uni_id, data) {
    let insertString = ''
    for (let d of data) {
      d.eduForm = d.eduForm ? d.eduForm : ' ';
      insertString += ` (${uni_id}, '${d.eduCode}', '${d.eduName}', '${d.eduLevel}', '${d.eduForm}', '${d.learningTerm}', '${d.dateEnd}', '${d.language}'),`
    }
    insertString = insertString.slice(0, -1)
    return new Promise((res, rej) => {
      db.query('insert into ' + tableName + ' (id_university, code, name, level, form, learning_term, date_end, language) values' + insertString,
        [],
        (err, result) => {
          if (err)
            return res(false)

          return res(result.rows)
        })
    })
  }

  /* [+] Удалить учебные программы */
  removeAll(id) {
    return new Promise((res, rej) => {
      db.query("delete from " + tableName + " where id_university = $1",
        [id],
        (err, result) => {
          if (err)
            return res(false)

          return res(result.rows)
        })
    })
  }

}

module.exports = new EduprogramService()