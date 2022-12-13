const bcrypt = require("bcrypt")
const User = require("../models/user");
const jwt = require("../services/jwt");


const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde controllers/user.js",
        usuario: req.user
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

const login = (req, res) => {
    //Recoger params
    let params = req.body;

    if (!params.email || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }

    // Buscar bbdd si existe
    User.findOne({ email: params.email })
        // .select({ "password": 0 }) //No devuelve la pwd
        .exec((error, user) => {
            if (error || !user) {
                return res.status(404).send({
                    status: "error",
                    message: "No existe el usuario"
                });
            }

            // Comprobar su contraseña (la escrita con la bbdd cifrada)
            let pwd = bcrypt.compareSync(params.password, user.password)

            if (!pwd){
                return res.status(400).send({
                    status: "error",
                    message: "No te has identificado correctamente"
                });
            }

            // Devolver token
            const token = jwt.createToken(user);



            // Eliminar pws del objeto

            // Devolver datos de usuario

            return res.status(200).send({
                status: "success",
                message: "Accion de login correcta",
                user: {
                    id:user._id,
                    name:user.name,
                    nick:user.nick
                },
                token
            })
        })

}

module.exports = {
    pruebaUser,
    register,
    login
}

