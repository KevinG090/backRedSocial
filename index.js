const  connection  = require("./database/connection");
const express = require("express");
const cors = require("cors");

// conexion bd
console.log("API NODE arrancada")
connection();

// crear servidor node
const app = express();
const puerto = 3900;

// configurar cors (se ejecuta antes de las rutas)
app.use(cors());

// convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true})); //cualquier dato codificable lo convierte

// cargar conf rutas


// ruta de prueba
app.get("/ruta-prueba",(req,res)=>{
    return res.status(200).json({
        "id":1,
        "nombre":"Kevin",
        "web":"kevinGuevara.com"
    })
})

// poner servidor a escuchar peticiones http
app.listen(puerto, () => {
    console.log("servidor corriendo")
})