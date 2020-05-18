const express = require("express"),
    router = express.Router(),
    userRoutes = require("./user.routes"),
    usersRoutes = require("./users.routes"),
    professionRoutes = require("./profession.routes"),
    positionRoutes = require("./position.routes"),
    universityRoutes = require("./university.routes"),
    universitiesRoutes = require("./universities.routes"),
    eduprogramRoutes = require("./eduprogram.routes");

router
/* [+] Пользователь */
.use('/user', userRoutes)
/* [+] Пользователи */
.use('/users', usersRoutes)
/* [+] Професии */
.use('/professions', professionRoutes)
/* [+] Должности */
.use('/positions', positionRoutes)
/* [+]  Университет */
.use('/university', universityRoutes)
/* [+] Университеты */
.use('/universities', universitiesRoutes)
/* [+] Программы обучения */
.use('/eduprograms', eduprogramRoutes);

module.exports = router;