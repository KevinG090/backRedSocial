const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde controllers/user.js"
    });
}

// Registro de usuarios
const register = (req, res) => {
    // Recoger datos de la peticion

    // Comprobar que llegan bien

    // Control de usuarios duplicados

    // Cifrar la contraseña

    // Guardar usuario en la bbdd

    // Devolver resultado
    return res.status(200).json({
        message: "Accion de registro de usuario"
    })
}

module.exports = { pruebaUser, register }

