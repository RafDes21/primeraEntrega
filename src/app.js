const dotenv = require("dotenv");
const express = require("express")
const routerProductos = require("./rutas/rutasProductos")
const routerCarrito = require("./rutas/rutasCarrito")

dotenv.config();
const PORT = process.env.PORT || 8080;
const app = express()

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas
app.use("/api/productos", routerProductos)
app.use("/api/carrito", routerCarrito )

app.listen(PORT, ()=>{
    console.log(`servidor escuchando en el puerto ${PORT}`);
})