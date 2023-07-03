// Aqui va la configuracion  del servidor
// const express = require('express') // va a node_modules, busca el paquete de express y lo asigna a la var.
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import conectarDB from './config/db.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import proyectoRoutes from './routes/proyectoRoutes.js'
import tareaRoutes from './routes/tareaRoutes.js'


const app = express()
app.use(express.json()) // para procesar la info tipo json q viene de los post de los controllers

dotenv.config()

conectarDB()

// Configurar CORS
const whitelist = [process.env.FRONTEND_URL]

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      // Puede consultar la API
      callback(null, true)
    } else {
      // No esta permitido
      callback(new Error("Error de Cors"))
    }
  },
};

app.use(cors(corsOptions))

// Routing
app.use("/api/usuarios", usuarioRoutes) // use soporta todos los verbos CRUD
app.use("/api/proyectos", proyectoRoutes)
app.use("/api/tareas", tareaRoutes)



const PORT = process.env.PORT || 4000

const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})


// Socket io
import { Server } from 'socket.io'

const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
})
// Abrimos una conexion de socket io
io.on("connection", (socket) => {
  console.log("Conectado a socket.io");

  // Definir los eventos de socket io
  socket.on('prueba', (proyectos) => { // se tiene q llamar igual q en el frontend
    console.log('prueba desde Socket io', proyectos)

    // enviar respuest
    socket.emit('respuesta', {nombre: "Armando"})
  });
})