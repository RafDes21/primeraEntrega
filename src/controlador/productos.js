const fs = require("fs");

class Contenedor {
  constructor(productos) {
    this.productos = productos;
  }
  read = async () => {
    try {
      const data = await fs.promises.readFile(this.productos, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.log(error);
    }
  };
  write = async (params) => {
    const nuevoProducto = JSON.stringify(params, null, 2);
    await fs.promises.writeFile(this.productos, nuevoProducto, "utf8");
  };
  save = async (obj) => {
    try {
      const allProducts = await this.read();
      if (allProducts.length === 0) {
        const newProduct = {
          id: 1,
          timestamp:Date.now(),
          ...obj,
        };
        await fs.promises.writeFile(
          this.productos,
          JSON.stringify([newProduct])
        );
        return 1;
      } else {
        const lastProductId = allProducts[allProducts.length - 1].id;
        const newProduct = {
          id: lastProductId + 1,
          timestamp:Date.now(),
          ...obj,
        };

        await fs.promises.writeFile(
          this.productos,
          JSON.stringify([...allProducts, newProduct])
        );

        return newProduct.id;
      }
    } catch (error) {
      console.log(error);
    }
  };

  getById = async (Id) => {
    const id = parseInt(Id);

    try {
      const data = JSON.parse(
        await fs.promises.readFile(this.productos, "utf8")
      );
      this.productosArray = data;
      const producto = this.productosArray.find(
        (producto) => producto.id === id
      );
      if (producto) return producto;
      else console.log("No se encontro el producto");
    } catch (err) {
      console.log(err);
    }
  };
  getAll = async () => {
    const data = await fs.promises.readFile(this.productos);

    const productos = await JSON.parse(data);

    if (productos.length) {
      const todosLosProductos = productos.map((producto) => producto);
      return todosLosProductos;
    } else {
      console.log("No hay productos");
    }
  };
  deleteById = async (idDelete) => {
    const id = parseInt(idDelete);
    try {
      const data = await fs.promises.readFile(this.productos);
      this.productosArray = JSON.parse(data);

      const newData = this.productosArray.findIndex((producto) =>
        producto.id === id ? true : false
      );
      if (newData !== -1) {
        this.productosArray.splice(newData, 1);
        this.write(this.productosArray);
        console.log("Producto borrado");
      } else {
        console.log("No se encontro el producto");
      }
    } catch (error) {
      console.log(error);
    }
  };
}
const contenedor = new Contenedor("./productos.json");
const contenedorCarrito = new Contenedor("./carrito.json");

(module.exports = contenedor), contenedorCarrito;
