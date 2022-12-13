const bcrypt = require("bcrypt")
const User = require("../models/user");


const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde controllers/user.js"
    })
};

// Registro de usuarios
const register = (req, res) => {
    // Recoger datos de la peticion
    let params = req.body;

    // Comprobar que llegan bien
    if (!params.name || !params.nick || !params.email || !params.password) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }



    // Control de usuarios duplicados
    User.find({
        $or: [
            { nick: params.nick.toLowerCase() },
            { email: params.email.toLowerCase() }
        ]
    }).exec(async (error, users) => {
        if (error) {
            return res.status(500).json({
                status: "error",
                message: "Error en la consulta de datos"
            });
        }
        if (users && users.length >= 1) {
            return res.status(200).send({
                status: "success",
                message: "El usuario ya EXISTE"
            });
        }

        // Cifrar la contraseña
        let pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;

        // Crear objeto de usuario
        let user_to_save = new User(params);

        // Guardar usuario en la bbdd
        user_to_save.save((error, userStored) => {
            if (error || !userStored) {
                return res.status(500).send({
                    status: "error",
                    message: "error al guardar usuario"
                });
            }

            // Devolver resultado
            return res.status(200).json({
                status: "success",
                message: "Usuario registrado correctamente",
                user: userStored
            });
        })




    });



};

module.exports = { pruebaUser, register }

