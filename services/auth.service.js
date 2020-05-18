const db = require("./db")
const tableName = "users"

class AuthService {

  /* [+] */
  login(login, password) {
    return new Promise((res, rej) => {
      db.query("select * from " + tableName + " where login = $1 and password = $2 and role <> 0",
        [login, password],
        (err, result) => {
          if (err)
            return res(false)

          return res(result.rows)
        })
    })
  }

  /* [+] */
  logout(login, password) {
    return new Promise((res, rej) => {
      db.query("select * from " + tableName + " where login = $1 and password = $2 and role <> 0",
        [login, password],
        (err, result) => {
          if (err)
            return res(false)

          return res(result.rows)
        })
    })
  }

  authSession(uid) {
    return new Promise((res, rej) => {
      db.query("select * from " + tableName + " where uid = $1 and role <> 0",
        [uid],
        (err, result) => {
          if (err)
            return res(false)

          return res(result.rows)
        })
    })
  }

  /* [+] */
  setSessionID(login, sessionID) {
    return new Promise((res, rej) => {
      db.query("update " + tableName + " set uid = $2 where login = $1",
        [login, sessionID],
        (err, result) => {
          if (err)
            return res(false)

          return res(result.rows)
        })
    })
  }

    /* [+] */
    delSessionID(uid) {
      return new Promise((res, rej) => {
        db.query("update " + tableName + " set uid = $2 where uid = $1",
          [uid, null],
          (err, result) => {
            if (err)
              return res(false)
  
            return res(result.rows)
          })
      })
    }

}

module.exports = new AuthService()