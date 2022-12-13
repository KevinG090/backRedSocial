const moment = require("moment");
const jwt = require("jwt-simple");

// Importar clave secreta
const libjwt = require("../services/jwt");
const secret = libjwt.secret;

// MIDDLEWARE de autenticacion
exports.auth = (req, res, next) => {

    // Comprobar si me llega a la cabecera de auth
    if (!req.headers.authorization) {
        return res.status(403).send({
            status: "error",
            message: "la peticion no tene la cabecera de autenticacion"
        });
    }
    // Limpiar token (se quita las comillas)
    let token = req.headers.authorization.replace(/['"]+/g, '')

    // Decodificar el token
    try {
        let payload = jwt.decode(token, secret);

        // comprobar expiracion
        if (payload.exo <= moment().unix()) {
            return res.status(404).send({
                status: "error",
                message: "Token expirado"
            });
        }

        // Agregar datos de usuario a request
        req.user = payload;

    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "Token invalido",
            error
        });
    }


    // Pasar a ejecucion de accion
    next();
}
