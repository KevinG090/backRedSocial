const express = require("express");
const router = express.Router()

const UseController = require("../controllers/user.js")

const check = require("../middlewares/auth")

// Definir rutas
router.get("/prueba-usuario", check.auth, UseController.pruebaUser)
router.post("/register", UseController.register)
router.post("/login", UseController.login)


module.exports = router