const express = require("express")
const router = express.Router()
const check = require("../middlewares/auth")

const PubliController = require("../controllers/publication");

// Definir rutas

router.get("/prueba-publication", PubliController.pruebaPublication)
router.post("/save", check.auth, PubliController.save)

module.exports = router