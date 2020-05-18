/*** Модуль для работы с базой данных ***/
const { Client } = require('pg');

var conString = "postgres://postgres:12345@localhost:5432/postgres";

function query(sql, params, callback) {
    let client = new Client({
    /*connectionString: process.env.DATABASE_URL,
    ssl: true
    user: 'postgres',
    host: 'localhost',
    password: '12345',
    port: 50810,*/
    connectionString: process.env.DATABASE_URL || conString
});
    client.connect(function(err, client, done){
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

module.exports = {
    /*[+] Получить список университетов */
    universityGetAll: function (callback) {
        query('select * from educational', [], (err, result)=>{
            callback(err, result.rows);
        });
    },
    /*[+] Получить университет по id */
    universityGet: function (id, callback) {
        query('select * from educational where "id" = $1', [id], (err, result)=>{
            callback(err, result.rows);
        });
    },
    /*[+] Добавить университет */
    universityAdd: function (data, callback) {
        query('insert into educational ("fullName", "shortName", "url") values ($1,$2,$3) returning id', [data.fullName, data.shortName, data.url], (err, result) => {
            callback(err, result.rows[0].id);
        });
    },
    /*[+] Изменить университет по id */
    universityUpdate: function (id, data, callback) {
        query('update educational set "fullName" = $1, "shortName" = $2, "url" = $3 where id = $4', [data.fullName, data.shortName, data.url, id], (err, result) => {
            callback(err, result.rows);
        });
    },
    /*[+] Удалить университет по id */
    universityDel: function (id, callback) {
        query('delete from educational where "id" = $1', [id], (err, result) => {
            callback(err, result.rows);
        });
    },
    /*[-] Обновить учебные программы университета по id */
    universityRefresh: function (id, date, callback) {
        query('update educational set "lastUpdate" = $1 where id = $2', [date, id], (err, result) => {
            callback(err, result.rows);
        });
    },
}