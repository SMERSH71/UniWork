module.exports = function (connect) {
    const { Client } = require('pg');

    var conString = "postgres://postgres:12345@localhost:5432/postgres";

    const Store = connect.Store || connect.session.Store;
    let ss = {}
    class PGStore extends Store {
        constructor(options = {}) {
            super(options)
            var self = this;
            options = options || {};
            Store.call(self, options);
            self.options = options;
            this.query(`CREATE TABLE IF NOT EXISTS sessions (
                sid text NOT NULL,  
                session json NOT NULL,  
                PRIMARY KEY (sid)
              )`, [], (err, result)=>{})
        }

        query(sql, params) {
            //console.log(sql)
            return new Promise((res, rej) => {
            let client = new Client({
                connectionString: process.env.DATABASE_URL || conString
            });
            client.connect(function (err, client, done) {
                if (err) {
                    return console.error('error fetching client from pool', err)
                }
                client.query(sql, params, function (err, result) {
                    //done();
                    client.end()
                    if (err) {
                        console.error('error running query', err)
                    }
                    if (err)
                        return res(false)

                    return res(result)
                });
            })})
        }

        async get(sessionId, callback) {
            try {
                let result = await this.query("select * from sessions where sid = $1", [sessionId])
                if(result) return callback(null, result.rows.length?result.rows[0].session:null)
            } catch (err) {
                if (callback) return callback(err);
            }
        }

        async set(sessionId, session, callback) {
            try {
                let result = await this.query("select * from sessions where sid = $1", [sessionId])
                if(result.rows.length){
                    result = await this.query("update sessions set session = $2 where sid = $1",[sessionId, session])
                    return callback(null, session)
                } else{
                    result = await this.query("insert into sessions (sid, session) values ($1,$2)",[sessionId, session])
                    return callback(null, session)
                }
            } catch (err) {
                if (callback) return callback(err);
            }
        }

        touch(sessionId, session, options, callback) {
            console.log('touch')
            return callback()
        }

        async destroy(sessionId) {
            try {
                let result = await this.query("delete from sessions where sid = $1", [sessionId])
            } catch (err) {

            }
        }
        length(options, callback) {
            console.log('length')
            return callback()
        }
        clear(options, callback) {
            console.log('clear')
            return callback()
        }
        list(options, callback) {
            console.log('list')
            return callback()
        }
        expired(sessionId, options, callback) {
            console.log('expired')
            return callback()
        }
    }
    return PGStore
}