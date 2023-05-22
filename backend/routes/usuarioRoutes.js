import express from 'express'
const router = express.Router()

import { usuarios } from '../controllers/usuarioController.js'

// Autenticacion, Registro y Confirmacion de usuarios

router.get('/', usuarios)

export default router