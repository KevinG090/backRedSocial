const express = require("express");
const router = express.Router()

const FollowController = require("../controllers/follow")
const check = require("../middlewares/auth") //para rutas privadas

// Definir rutas
router.get("/prueba-follow", FollowController.pruebaFollow)

// Accion de guardar follow (accion a seguir)
router.post("/save", check.auth, FollowController.save)

// Accion de borrar un follow (accion de dejar de seguir)

// Accion listado de usuarios q estoy siguiendo

// Accion listado de usuarios que me siguen

module.exports = router