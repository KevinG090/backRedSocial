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
        if (error || !followStored) { return res.status(500).send({ status: "error", message: "No se ha seguido al usuario" }); };

        return res.status(200).send({
            status: "Success",
            message: "Has seguido a alguien correctamente ",
            params,
            identity,
            follow: followStored
        });
    })
}

const unfollow = (req, res) => {
    // Recoger la id del usuario identificado
    const userId = req.user.id;
    // Recoger la id de la url
    const followId = req.params.id;

    // find de las coincidencias y hacer remove
    Follow.find({
        "user": userId,
        "followed": followId

    }).remove((error, followDelete) => {
        if (error || !followDelete) { return res.status(500).send({ status: "error", message: "No se ha podido eliminar el follow" }); };

        return res.status(200).send({
            status: "success",
            message:"Follow eliminado correctamente",
            followDelete
        })
    });
}

module.exports = {
    pruebaFollow,
    save,
    unfollow
}