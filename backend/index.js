// Aqui va la configuracion  del servidor
// const express = require('express') // va a node_modules, busca el paquete de express y lo asigna a la var.
import express from 'express'
import conectarDB from './config/db.js'

const app = express()

conectarDB()

app.listen(4000, () => {
  console.log('Servidor corriendo en el puerto 4000')
})