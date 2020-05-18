/*** Модуль для работы с API ***/
const db = require('./db.js');

module.exports = (express, app) => {

    const apiUniversityRouter = express.Router();

    /*[+] Получить список университетов */
    apiUniversityRouter.get("/", (req, res) => {
        db.universityGetAll((err, result) => {
            if (err != '') {
                res.send(JSON.stringify({ error: false, data: result }));
            } else {
                res.send(JSON.stringify({ error: true, data: err }));
            }
        })
    });
    /*[+] Получить университет по id */
    apiUniversityRouter.get("/:id", (req, res) => {
        if (req.params.id != '')
            db.universityGet(req.params.id, (err, result) => {
                if (err != '') {
                    res.send(JSON.stringify({ error: false, data: result }));
                } else {
                    res.send(JSON.stringify({ error: true, data: err }));
                }
            })
    });
    /*[+] Обновить учебные программы университета по id */
    apiUniversityRouter.get("refresh/:id", (req, res) => {
        if (req.params.id != '')
            db.universityRefresh(req.params.id, (err, result) => {
                if (err != '') {
                    res.send(JSON.stringify({ error: false, data: result }));
                } else {
                    res.send(JSON.stringify({ error: true, data: err }));
                }
            })
    });
    /*[+] Добавить университет */
    apiUniversityRouter.post("/", (req, res) => {
        db.universityAdd(req.body, (err, result) => {
            if (err != '') {
                res.send(JSON.stringify({ error: false, data: result }));
            } else {
                res.send(JSON.stringify({ error: true, data: err }));
            }
        })
    });
    /*[+] Изменить университет по id */
    apiUniversityRouter.put("/:id", (req, res) => {
        if (req.params.id != '')
            db.universityUpdate(req.params.id, req.body, (err, result) => {
                if (err != '') {
                    res.send(JSON.stringify({ error: false }));
                } else {
                    res.send(JSON.stringify({ error: true, data: err }));
                }
            })
    });
    /*[+] Удалить университет по id */
    apiUniversityRouter.delete("/:id", (req, res) => {
        console.log(req.params.id);
        if (req.params.id != '')
            db.universityDel(req.params.id, (err, result) => {
                if (err != '') {
                    res.send(JSON.stringify({ error: false }));
                } else {
                    res.send(JSON.stringify({ error: true, data: err }));
                }
            })
    });

    app.use("/api/university", apiUniversityRouter);
};
