import express from 'express'
const router = express.Router()

import {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword
} from '../controllers/usuarioController.js'

// Autenticacion, Registro y Confirmacion de usuarios
router.post('/', registrar) // Crea un nuevo usuario
router.post('/login', autenticar)
router.get('/confirmar/:token', confirmar)
router.post('/olvide-password', olvidePassword)
// podemos juntar las dos:
// router.get('/olvide-password/:token', comprobarToken)
// router.post('/olvide-password/:token', nuevoPassword)
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)


export default router