const Follow = require("../models/follow")
const User = require("../models/user");
const { use } = require("../routes/user");
const followService = require("../services/followUserIds")

// const mongoosePaginate = require("mongoose-pagination")

const pruebaFollow = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde controllers/follow.js"
    });
}

const save = (req, res) => { // Seguir

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

const unfollow = (req, res) => { // Dejar de seguir
    // Recoger la id del usuario identificado
    const userId = req.user.id;
    // Recoger la id de la url
    const followId = req.params.id;

    // Encontrar de las coincidencias y hacer remove
    Follow.find({ "user": userId, "followed": followId })
        .remove((error, followDelete) => {
            if (error || !followDelete) { return res.status(500).send({ status: "error", message: "No se ha podido eliminar el follow" }); };

            return res.status(200).send({
                status: "success",
                message: "Follow eliminado correctamente",
                followDelete
            })
        });
}

const following = (req, res) => { // Lista de los que sigo
    // Sacar id del identificado
    let userId = req.user.id;
    let page = 1;

    // Comprobar si me llega el id por parametro en url
    if (req.params.id) userId = req.params.id;

    // Comprobar si me llega la pagina
    if (req.params.page) page = req.params.page;

    // Usuarios por pagina
    const itemsPerPage = 5;

    // Find a follow, popular datos de los usuarios y paginar ocn mongoose paginate 
    // pupulate sirve para mostrar los objetos gracias a la ID
    Follow.find({ user: userId })
        .populate("user followed", "name -_id")
        .paginate(page, itemsPerPage, async (error, follows, total) => { //paginar los follows (mongoose)
            if (error || !follows) { return res.status(500).send({ status: "error", message: "No se han encontrado follows" }); };
            //  Sacar un array de los usuarios que me siguen como usuario identificado
            let followUserIds = await followService.followUserIds(userId);
            return res.status(200).send({
                status: "success",
                name: req.user.name,
                page,
                totalFollows: total,
                totalPages: Math.ceil(total / itemsPerPage),
                message: "Listado de usuarios que sigo",
                user_following: followUserIds.following,
                user_follow_me: followUserIds.followers
            })
        })
    /* En caso que no se requiera paginar
    .exec((error, follows) => {
        if (error || !follows) { return res.status(500).send({ status: "error", message: "No se han encontrado follows" }); };
        return res.status(200).send({ status: "success",message: "Listado de usuarios que sigo",follows})
    })*/
}

const followers = (req, res) => {// Lista de seguidores

    // Sacar id del identificado
    let userId = req.user.id;
    let page = 1;

    // Comprobar si me llega el id por parametro en url
    if (req.params.id) userId = req.params.id;

    // Comprobar si me llega la pagina
    if (req.params.page) page = req.params.page;

    // Usuarios por pagina
    const itemsPerPage = 5;

    Follow.find({ followed: userId })
        .populate("user", "name")
        .paginate(page, itemsPerPage, async (error, follows, total) => { //paginar los follows (mongoose)
            if (error || !follows) { return res.status(500).send({ status: "error", message: "No se han encontrado follows" }); };
            //  Sacar un array de los usuarios que me siguen como usuario identificado
            let followUserIds = await followService.followUserIds(userId);
            return res.status(200).send({
                status: "success",
                name: req.user.name,
                page,
                totalFollows: total,
                totalPages: Math.ceil(total / itemsPerPage),
                message: "Listado de usuarios que me siguen",
                user_following: followUserIds.following,
                user_follow_me: followUserIds.followers,
                follows
            })
        })

}

module.exports = {
    pruebaFollow,
    save,
    unfollow,
    following,
    followers
}