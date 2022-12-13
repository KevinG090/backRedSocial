const express = require("express");
const router = express.Router()

const UseController = require("../controllers/user.js")

const check = require("../middlewares/auth") //para rutas privadas

// Definir rutas
router.get("/prueba-usuario", check.auth, UseController.pruebaUser)
router.post("/register", UseController.register)
router.post("/login", UseController.login)
router.get("/profile/:id", check.auth, UseController.profile)
router.get("/list/:page?", check.auth, UseController.list)


module.exports = router