const PORT = process.env.PORT || 3000
const express = require("express")
const session = require("express-session")
//const bodyParser = require("body-parser")
//const config = require("./config/app")
const pgStore = require("./pg-store")(session)
const auth = require("./controllers/auth.controller")
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
const app = express();

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static(__dirname + "/public"))

app.use(
    session({
        store: new pgStore(),
        secret: 'SMERSH71',
        saveUninitialized: false,
        cookie:{
            maxAge: 3600 * 24
        }
    })
)

app.use(auth.authChecker)

app.post('/login', auth.login)

app.post('/logout', auth.logout)

const routesAPI = require('./routes/router')
app.use('/api', routesAPI)

const routesPage = require('./routes/page.routes')
app.use('/', routesPage)

console.clear()

/* Запускаем сервер */
app.listen(PORT, () => {
    console.log(`Go to http://localhost:${PORT}`)
})