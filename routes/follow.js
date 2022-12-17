const express = require("express");
const router = express.Router()

const FollowController = require("../controllers/follow")
const check = require("../middlewares/auth") //para rutas privadas

// Definir rutas
router.get("/prueba-follow", FollowController.pruebaFollow)
router.post("/save", check.auth, FollowController.save)// Accion de guardar follow (accion a seguir)
router.delete("/unfollow/:id", check.auth, FollowController.unfollow)// Accion de borrar un follow (accion de dejar de seguir)
router.get("/following/:id?/:page?", check.auth, FollowController.following)// Accion listado de usuarios q estoy siguiendo
router.get("/followers/:id?/:page?",  check.auth, FollowController.followers)// Accion listado de usuarios que me siguen

module.exports = router
