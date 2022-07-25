const { Router } = require("express");
const contenedor = require("../controlador/productos");

const router = Router()

router.route("/")
  .get(async (req, res) => {
    const data = await contenedor.getAll()
    res.json(data)
  })
  .post(async (req, res) => {
    if (req.headers.admin === "true") {
      try {
        await contenedor.save(req.body)
        res.sendStatus(201)
      } catch (error) {
        console.log(error);
      }
    } else {
      res.status(401).send("ruta no autorizada")
    }
  })
      
      
router.route("/:id")
      .get((req, res) => {
        contenedor.getById(req.params.id).then((data) => {
        res.send(data)})
      })
      .put((req, res)=>{
        let id = req.params.id -1;
    try {
      const baseDatos = JSON.parse(
        fs.readFileSync("./productos.json", "utf8")
      );
      baseDatos[id]["title"] = req.body.title;
      baseDatos[id]["price"] = req.body.price;
      baseDatos[id]["thumbnail"] = req.body.thumbnail;
      console.log(baseDatos[req.params.id]);
      fs.writeFileSync(
        "./productos.json",
        JSON.stringify(baseDatos, null, 2)
      );
     
      res.send(baseDatos);
    } catch (err) {
      console.log(err);
    }

       })
      .delete((req, res)=>{
        contenedor.deleteById(req.params.id);
        res.sendStatus(200);
      })
     
module.exports = router
  
      
     

   
      
  
    
    
      
    
    










