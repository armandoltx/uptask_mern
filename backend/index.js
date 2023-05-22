// Aqui va la configuracion  del servidor
// const express = require('express') // va a node_modules, busca el paquete de express y lo asigna a la var.
import express from 'express'
import dotenv from 'dotenv'
import conectarDB from './config/db.js'
import usuarioRoutes from './routes/usuarioRoutes.js'

const app = express()
app.use(express.json()) // para procesar la info tipo json q viene de los post de los controllers

dotenv.config()

conectarDB()

// Routing
app.use("/api/usuarios", usuarioRoutes) // use soporta todos los verbos CRUD




const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})