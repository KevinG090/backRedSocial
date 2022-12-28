// const Publication = require("../models/publication")

const pruebaPublication = (req, res) =>{
    return res.status(200).send({
        message:"Mensaje enviado desde controllers/publication.js"
    });
} 
// Guardar publicacion

// Sacar una publicacion

// Listar todas las publicaciones

// Listar publicaciones de un usuario

// Eliminar publicaciones

// Subir ficheros

// Devolver archivos multimedia 

// Exportar acciones
module.exports = {
    pruebaPublication
}