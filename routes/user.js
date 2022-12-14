const multer = require("multer");
const express = require("express");
const router = express.Router()

const UseController = require("../controllers/user.js")
const check = require("../middlewares/auth") //para rutas privadas

// Configuracion de subida (multer)
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,"./uploads/avatars")//guardar en esta direccion
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-"+Date.now()+"-"+file.originalname)//guardar con el nombre indicado
    }
});

const uploads = multer({storage})


// Definir rutas
router.get("/prueba-usuario", check.auth, UseController.pruebaUser)
router.post("/register", UseController.register)
router.post("/login", UseController.login)
router.get("/profile/:id", check.auth, UseController.profile)
router.get("/list/:page?", check.auth, UseController.list)
router.put("/update", check.auth, UseController.update)
router.post("/upload", [check.auth, uploads.single("file0")], UseController.upload)
router.get("/avatar/:file", check.auth, UseController.avatar)


module.exports = router