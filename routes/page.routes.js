const express = require("express")
const router = express.Router()
const pageRouter = express.Router()

const PageController = require("../controllers/page.controller")
  let g = `/* [+] Страница входа */
  .get("/", PageController.pager)
  /* [+] Страница администратора */
  .get("/admin", PageController.pager)
  /* [+] Страница администратора */
  .get("/admin/*", PageController.pager)
  /* [+] Страница работника университета */
  .get("/empuni", PageController.pager)
  /* [+] Страница работника университета */
  .get("/empuni/*", PageController.pager)
  /* [+] Страница работника ЦЗН */
  .get("/empwork", PageController.pager)
  /* [+] Страница работника ЦЗН */
  .get("/empwork/*", PageController.pager)
  /* [+] Страница работодателя */
  .get("/empjob", PageController.pager)
  /* [+] Страница работодателя */
  .get("/empjob/*", PageController.pager)`
  
  pageRouter
  /* [+] Страница входа */
  .get("/", PageController.startPage)
  /* [+] Страница администратора */
  .get("/admin", PageController.adminPage)
  /* [+] Страница администратора */
  .get("/admin/*", PageController.adminPage)
  /* [+] Страница работника университета */
  .get("/empuni", PageController.uniPage)
  /* [+] Страница работника университета */
  .get("/empuni/*", PageController.uniPage)
  /* [+] Страница работника ЦЗН */
  .get("/empjob", PageController.jobPage)
  /* [+] Страница работника ЦЗН */
  .get("/empjob/*", PageController.jobPage)
  /* [+] Страница работодателя */
  .get("/empcompany", PageController.companyPage)
  /* [+] Страница работодателя */
  .get("/empcompany/*", PageController.companyPage)

module.exports = router.use('/', pageRouter)