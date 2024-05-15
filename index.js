const express = require('express')
const fs = require('fs/promises')

const app = express()

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

// Ruta Agregar
// servidor -> /agregar?nombre=Rayuela Corta&precio=2000
app.get("/agregar", (req, res) => {
  const { nombre, precio } = req.query

  fs.readFile("./data/deportes.json", "utf-8")
    .then(data => {
      const deportesJson = JSON.parse(data)
      // deportesJson = { "deportes": [] }

      // Creación de deporte
      const deporte = { 
        nombre,
        precio
      }

      // Agregamos nuevo deporte al JSON Parseado
      deportesJson.deportes.push(deporte)

      fs.writeFile("./data/deportes.json", JSON.stringify(deportesJson))
        .then(() => {
          console.log("Archivo actualizado")
          res.send(deportesJson);
        })
    })
})

app.get("/editar", (req, res) => {
  // editar?nombre=deporte&precio=precio
  const { nombre, precio } = req.query

  fs.readFile("./data/deportes.json", "utf-8")
    .then(data => {
      const deportesJson = JSON.parse(data)

      const deportesModificados = deportesJson.deportes.map( d => {
        if(d.nombre == nombre) {
          d.precio = precio
          return d
        } else {
          return d;
        }
      })

      deportesJson.deportes = deportesModificados;

      fs.writeFile("./data/deportes.json", JSON.stringify(deportesJson))
        .then(() => {
          console.log("Deporte Actualizado")
          res.send(deportesJson);
        })
    })
})

app.get("/eliminar", (req, res) => {
  const { nombre } = req.query

  fs.readFile("./data/deportes.json", "utf-8")
    .then(data => {
      const deportesJson = JSON.parse(data)

      const deportesFiltrados = deportesJson.deportes.filter(d => {
        return d.nombre !== nombre
      })

      deportesJson.deportes = deportesFiltrados

      fs.writeFile("./data/deportes.json", JSON.stringify(deportesJson))
        .then(() => {
          console.log("Deporte Eliminado")
          res.send(deportesJson);
        })
    })
})

// Respuesta deportes en formato JSON
// app.get("/deportes", (req, res) => {
//   fs.readFile("./data/deportes.json", "utf-8")
//     .then(data => {
//       const deportesJson = JSON.parse(data)

//       res.send(deportesJson)
//     })
// })

app.use("/deportes", express.static(__dirname + "/data/deportes.json"));

app.listen(3000, () => {
  console.log("APP EN EL PUERTO 3000")
})
