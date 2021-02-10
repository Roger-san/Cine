const express = require("express")
const api = express()
const fs = require("fs")
const films = "./db_films.json"

api.get("/api/film/:id", (req, res) => {
  fs.readFile(films, (error, data) => {
    if (error) throw error
    else {
      data = JSON.parse(data)
      res.status(200).send({
        success: true,
        message: "Lista de peliculas",
        films: data.filter((x) => x.id === req.params.id),
      })
    }
  })
})

api.get("/api/films", (req, res) => {
  fs.readFile(films, (error, data) => {
    if (error) throw error
    else {
      data = JSON.parse(data)
      res.status(200).send({
        success: true,
        message: "Lista de peliculas",
        films: data,
      })
    }
  })
})

api.get("/api/films/genre", (req, res) => {
  fs.readFile(films, (error, data) => {
    if (error) throw error
    else {
      data = JSON.parse(data)
      res.status(200).send({
        success: true,
        message: "Lista de peliculas",
        films: data.filter((x) => x.genre === req.query.genre),
      })
    }
  })
})

api.get("/api/films/page:pageN", (req, res) => {
  fs.readFile(films, (err, data) => {
    if (err) throw err
    else {
      data = JSON.parse(data)
      const PAGESIZE = 5
      const paramPage = Number.parseInt(req.params.pageN)
      const start = PAGESIZE * paramPage - PAGESIZE
      data = data.splice(start, PAGESIZE)
      res.status(200).send({
        success: true,
        message: "Lista de peliculas",
        films: data,
      })
    }
  })
})

api.get("/api/films/:filmId/actors/:actorId", (req, res) => {
  fs.readFile(films, (err, data) => {
    if (err) throw err
    else {
      data = JSON.parse(data)

      const film = data.filter((data) => data.id === req.params.filmId)
      const actor = film[0].actors.filter(
        (actor) => actor.id === req.params.actorId
      )
      res.status(200).send({
        success: true,
        message: `Actor de la pelicula ${film[0].name}`,
        actor: actor,
      })
    }
  })
})

api.post("/api/film", (req, res) => {
  fs.readFile(films, (error, data) => {
    if (error) throw error
    else {
      data = JSON.parse(data)
      const actors = req.query.actors.split(",")
      const actorsList = actors.map((actor, index) => ({
        id: "0" + String(index + 1),
        name: actor,
      }))
      data.push({
        id: String(data.length + 1),
        name: req.query.name,
        genre: req.query.genre,
        director: req.query.director,
        year: req.query.year,
        actors: actorsList,
      })
      console.log(data)
      fs.writeFile(films, JSON.stringify(data), (error) => {
        if (error) {
          res.status(400).send({
            success: false,
          })
        } else {
          res.status(400).send({
            success: true,
            message: "Lista de peliculas",
            films: data,
          })
        }
      })
    }
  })
})

api.put("/api/film/:id", (req, res) => {
  fs.readFile(films, (error, data) => {
    if (error) throw error
    else {

      data = JSON.parse(data)
      const id = Number.parseInt(req.params.id) - 1

      if (req.query.actors) {
        const newActors = req.query.actors.split(",")
        let actors = data[id].actors.map((actor) => actor.name)

        newActors.forEach((newActor) =>
          actors.includes(newActor) ? undefined : actors.push(newActor)
        )
        data[id].actors = actors.map((actor, index) => ({
          id: "0" + String(index + 1),
          name: actor,
        }))

      }
      const film = {
        id: req.params.id,
        name: req.query.name || data[id].name,
        genre: req.query.genre || data[id].genre,
        director: req.query.director || data[id].director,
        year: req.query.year || data[id].year,
        actors: data[id].actors,
      }
      console.log(film)
      data[id] = film
      fs.writeFile(films, JSON.stringify(data), (error) => {
        if (error) {
          res.status(400).send({
            success: false,
          })
        } else {
          res.status(200).send({
            success: true,
            message: "Lista de peliculas",
            films: data[id],
          })
        }
      })
    }
  })
})

api.delete("/api/film", (req, res) => {
  fs.readFile(films, (error, data) => {
    if (error) throw error
    else {
      data = JSON.parse(data)
      data = data.filter((x) => x.name !== req.query.name)
      console.log(data)
      fs.writeFile(films, JSON.stringify(data), (error) => {
        if (error) {
          res.status(400).send({
            success: false,
          })
        } else {
          res.status(400).send({
            success: true,
            message: "Lista de peliculas",
            films: data,
          })
        }
      })
    }
  })
})

api.listen(1015, () => {
  console.log("api corriendo en localhost:1015")
})
