// Importar modelo
const User = require("../models/user");
// Importar dependencias y servicios
const bcrypt = require("bcrypt")
const jwt = require("../services/jwt");
const mongoosePagination = require("mongoose-pagination");
const fs = require("fs")
const path = require("path")


const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde controllers/user.js",
        usuario: req.user
    })
};

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

            if (!pwd) {
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
                    id: user._id,
                    name: user.name,
                    nick: user.nick
                },
                token
            })
        })

}

const profile = (req, res) => {
    //Recoger params del id por la url
    const id = req.params.id;

    // Consulta para sacar los datos del usuario
    User.findById(id)
        .select({ password: 0, role: 0 })
        .exec((error, userProfile) => {
            if (error || !userProfile) {
                return res.status(404).send({
                    status: "error",
                    message: "Usuario no existe o hay un error"
                });
            }
            // devolver resultado
            return res.status(200).send({
                status: "success",
                message: "perfil de manera exitosa",
                user: userProfile
            })
        })
}

const list = (req, res) => {
    // Controlar la paginacion
    let page = 1;

    if (req.params.page) page = req.params.page;
    page = parseInt(page);

    // Consulta con mongoose paginate
    let itemsPerPage = 3;

    User.find().sort("_id").paginate(page, itemsPerPage, (error, users, total) => {
        if (error || !users) {
            return res.status(404).send({
                status: "error",
                message: "No hay usuarios disponibles",
                error
            });
        }

        // Devolver el resultado
        return res.status(200).send({
            status: "success",
            page,
            itemsPerPage,
            total,
            users,
            pages: Math.ceil(total / itemsPerPage)
        })
    })


}

const update = (req, res) => {
    // Recoger los datos del usuario (token-authorization)
    let userIdentity = req.user;
    // Recoger los datos del usuario modificado
    let userToUpdate = req.body;

    // Eliminar datos sobrantes
    delete userIdentity.iat;
    delete userIdentity.exp;
    delete userIdentity.rol;
    delete userIdentity.imagen;

    // Comprobar si el usuario ya existe (email,nick)
    // Control de usuarios duplicados
    User.find({
        $or: [
            { nick: userToUpdate.nick.toLowerCase() },
            { email: userToUpdate.email.toLowerCase() }
        ]
    }).exec(async (error, users) => {
        if (error) {
            return res.status(500).json({
                status: "error",
                message: "Error en la consulta de datos"
            });
        }

        let userIsset = false;
        users.forEach(user => {
            if (user && user._id != userIdentity.id) userIsset = true;
        })

        if (userIsset) {
            return res.status(200).send({
                status: "success",
                message: "El usuario ya EXISTE"
            });
        }

        // Cifrar la contraseña
        if (userToUpdate.password) {
            let pwd = await bcrypt.hash(userToUpdate.password, 10);
            userToUpdate.password = pwd;
        }
        // Buscar y actualizar
        try {
            let userUpdate = await User.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true });
            if (!userUpdate) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al actualizar",
                });
            }
            return res.status(200).send({
                status: "success",
                message: "Actualizacion de datos exitosa",
                user: userToUpdate
            });

        } catch (error) {
            return res.status(500).send({
                status: "error",
                message: "Error al actualizar datos",
            });
        }

        /*--OPCION DE BUSCAR Y ACTUALIZAR CON CALLBACK--*/
        // User.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true }, (error, userUpdate) => {
        //     if (error || !userUpdate){return res.status(500).send({status: "error",message: "Error al actualizar datos",error});}
        //     return res.status(200).send({status: "success",message: "Actualizacion de datos exitosa",user: userToUpdate});
        // })
    });
}

const upload = (req, res) => {

    // Recoger fichero de imagen y comprobar que existe
    if (!req.file) { return res.status(404).send({ status: "error", message: "Peticion no incluye la imagen" }); };

    // Conseguir el nombre del archivo
    let image = req.file.originalname;

    // Sacar la extension del archivo
    const imageSplit = image.split("\.");
    const extension = imageSplit[1]

    // Comprovar extension
    if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {
        // Hallar la direccion del archivo
        const filePath = req.file.path;

        // borrar archivo subido ("fs")
        const fileDeselete = fs.unlinkSync(filePath);
        return res.status(404).send({ status: "error", message: "Extension del fichero invalida" });
    }

    // Si si es correcta guardar img en bbdd
    User.findByIdAndUpdate(req.user.id, { image: req.file.filename }, { new: true }, (error, userUpdate) => {
        if (error || !userUpdate || !image) { return res.status(500).send({ status: "error", message: "Error al actuaizar imagen" }); };

        // Devolver respuesta
        return res.status(200).send({
            status: "success",
            user: userUpdate,
            file: req.file
        })
    })


}

const avatar = (req, res) => {
    // Sacar el parametro de la url
    const file = req.params.file;

    // Montar el path real de la imagen
    const filepath = "./uploads/avatars/" + file;

    // Comprobar que existe ("fs")
    fs.stat(filepath, (error,exist) => {
        if (!exist) return res.status(404).send({ status: "error", message: "No existe la imagen" });

        // Devolver un file
        return res.sendFile(path.resolve(filepath))

    })

}

module.exports = {
    pruebaUser,
    register,
    login,
    profile,
    list,
    update,
    upload,
    avatar
}

