const Follow = require("../models/follow")
const User = require("../models/user")

const pruebaFollow = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde controllers/follow.js"
    });
}

const save = (req, res) => {

    // Sacar los datos por el body
    const params = req.body;

    // Sacar id del usuario identificado
    const identity = req.user;

    // crear objeto con modelo follow
    let follow_to_save = new Follow({
        user: identity.id,
        followed: params.followed
    })

    // Guardar el follow en la bbdd
    follow_to_save.save((error, followStored) => {
        if (error || !followStored) { return res.status(500)({ status: "error", message: "No se ha seguido al usuario" }); };
        
        return res.status(200).send({
            status: "Success",
            message: "Has seguido a alguien correctamente ",
            params,
            identity,
            follow: followStored
        });
    })
}
module.exports = {
    pruebaFollow,
    save
}