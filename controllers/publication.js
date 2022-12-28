const Publication = require("../models/publication")

const pruebaPublication = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde controllers/publisadf gdhdrewcation.js"
    });
}

// Guardar publicacion
const save = (req, res) => {
    // recoger datos del body
    const params = req.body;

    // verificar si llegan
    if (!params.text) return res.status(400).send({ status: "error", message: "Debes enviar el textode la publicacion" });

    // crear y rellenar objeto
    let newPublication = new Publication({
        user: req.user.id,
        text: params.text
    })

    // guardar objeto bbdd
    newPublication.save((error, publicationStored) => {
        if (error || !publicationStored) return res.status(400).send({ status: "error", message: "No se ha guardado la publicacion" });
        return res.status(200).send({
            status: "success",
            message: "Guardar publicacion",
            publicationStored
        });
    })

}

// Sacar una publicacion

// Listar todas las publicaciones

// Listar publicaciones de un usuario

// Eliminar publicaciones

// Subir ficheros

// Devolver archivos multimedia 

// Exportar acciones

module.exports = {
    pruebaPublication,
    save
}