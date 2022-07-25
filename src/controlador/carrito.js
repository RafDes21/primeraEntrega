const fs = require("fs");

class Contenedor {
  constructor(productos) {
    this.productos = productos;
  }
  //lee el archivo carrito.json
  read = async () => {
    try {
      const data = await fs.promises.readFile(this.productos, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.log(error);
    }
  };
  //escribe en el archivo carrito.json
  write = async (params) => {
    const nuevoProducto = JSON.stringify(params, null, 2);
    await fs.promises.writeFile(this.productos, nuevoProducto, "utf8");
  };
  // crear un nuevo carrito
  async addItem(object) {
    try {
      const carritos = await this.read();
      carritos.push(object);
      await this.write(carritos);
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  }
  // selecciona un carrito
  getById = async (idCarrito) => {
    let id = parseInt(idCarrito);
    try {
      const carritos = await this.read();
      const itemCarrito = carritos.find((item) => item.id === id);
      return itemCarrito;
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  };
  //Agrega productos al carrito seleccionado
  save = async (idCarrito, producto) => {
    const itemCarrito = await this.getById(idCarrito);
    const { productos } = itemCarrito;
    try {
      if (productos.length === 0) {
        let nuevoProducto = {
          id: 1,
          timestamp:Date.now(),
          ...producto,
        };
        productos.push(nuevoProducto);
        const data = await this.read();
        data.map((producto) => {
          if (producto.id === itemCarrito.id) {
            producto.productos = itemCarrito.productos;
          }
        });
        return this.write(data);
      }
      if (productos.length > 0) {
        let nuevoProducto = {
          id: productos.length + 1,
          timestamp:Date.now(),
          ...producto,
        };
        productos.push(nuevoProducto);
        const data = await this.read();
        data.map((producto) => {
          if (producto.id === itemCarrito.id) {
            producto.productos = itemCarrito.productos;
          }
        });
        return this.write(data);
      }
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  };
  //trae todos los productos dentro de un carrito por su id
  getAll = async (idCarrito) => {
    const itemCarrito = await this.getById(idCarrito);
    try {
      if (itemCarrito) {
        return itemCarrito;
      }
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  };
  //elimina un carrito
  deleteById = async (idDelete) => {
    let id = parseInt(idDelete);
    const carritos = await this.read();
    try {
      if (carritos) {
        carritos.splice(id - 1, 1);
        this.write(carritos);
      }
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  };
  //Eliminar un producto de un carrito
  deleteCartProd = async (id, idDelete) => {
    const idCarrito = parseInt(id);
    const idProducto = parseInt(idDelete);
    const itemCarrito = await this.getById(idCarrito);
    try {
      itemCarrito.productos.splice(idProducto - 1, 1);
      const data = await this.read();
      data.map((producto) => {
        if (producto) {
          producto.productos = itemCarrito.productos;
        }
      });
      return this.write(data);
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  };
}
const contenedorCarrito = new Contenedor("./carrito.json");
module.exports = contenedorCarrito;
