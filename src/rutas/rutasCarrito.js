const { Router } = require("express");
const bdCarrito = require("../controlador/carrito");

const routerCarrito = new Router();
//en esta ruta se creará un nuevo carrito con su id
routerCarrito.post("/", async (req, res) => {
  try {
    const carritos = await bdCarrito.read();
    const getNewId = () => {
      let lastID = 0;
      if (carritos.length) {
        lastID = carritos[carritos.length - 1].id;
      }
      return lastID + 1;
    };

    const newCart = {
      id: getNewId(),
      timestamp: Date.now(),
      productos: [],
    };

    await bdCarrito.addItem(newCart);
    res.json(newCart.id);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
});

routerCarrito
  .route("/:id/productos")
  //Muestra los productos de un carrito
  .get(async (req, res) => {
    try {
      const data = await bdCarrito.getAll(req.params.id);
      res.json(data);
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  })
  //se agregará productos al carrito según id
  .post(async (req, res) => {
    try {
      await bdCarrito.save(req.params.id, req.body);
      res.send("producto agregado");
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  })
  .delete((req, res) => {});
//Vacía un carrito y lo elimina
routerCarrito.delete("/:id", async (req, res) => {
  try {
    await bdCarrito.deleteById(req.params.id);
    res.send("carrito eliminado");
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
});
//Elimina un producto de un carrito
routerCarrito.delete("/:id/productos/:id_prod", async (req, res) => {
  try {
    await bdCarrito.deleteCartProd(req.params.id, req.params.id_prod);
    res.send("producto eliminado");
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
});
module.exports = routerCarrito;
