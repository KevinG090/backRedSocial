const express = require("express");
const router = express.Router()

const FollowController = require("../controllers/follow")
const check = require("../middlewares/auth") //para rutas privadas

// Definir rutas
router.get("/prueba-follow", FollowController.pruebaFollow)

// Accion de guardar follow (accion a seguir)
router.post("/save", check.auth, FollowController.save)

// Accion de borrar un follow (accion de dejar de seguir)
router.delete("/unfollow/:id", check.auth, FollowController.unfollow)

// Accion listado de usuarios q estoy siguiendo
router.get("/following/:id?/:page?", check.auth, FollowController.following)

// Accion listado de usuarios que me siguen
router.get("/followers/:id?/:page?",  check.auth, FollowController.followers)

module.exports = router
