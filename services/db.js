/*** Модуль для работы с базой данных ***/
const { Client } = require('pg');

var conString = "postgres://postgres:12345@localhost:5432/postgres";

class DB {
    query(sql, params, callback) {
        let client = new Client({
            connectionString: process.env.DATABASE_URL || conString
        });
        client.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(sql, params, function (err, result) {
                //done();
                client.end();
                if (err) {
                    return console.error('error running query', err);
                }
                if (callback) {
                    callback(err, result);
                }
            });
        })
    }
}

module.exports = new DB()