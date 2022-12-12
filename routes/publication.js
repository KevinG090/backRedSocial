const express = require("express");
const router = express.Router()

const PubliController = require("../controllers/publication")

// Definir rutas

router.get("/prueba-publication", PubliController.pruebaPublication)

module.exports = router