const express = require("express");
const router = express.Router()

const UseController = require("../controllers/user.js")

// Definir rutas

router.get("/prueba-usuario", UseController.pruebaUser)


module.exports = router