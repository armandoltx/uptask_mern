import express from 'express'
import {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  aregarColaborador,
  eliminarColaborador,
  obtenerTareas
} from '../controllers/proyectoController.js'

import checkAuth from '../middleware/checkAuth.js'

const router = express.Router()

// router.get('/', checkAuth, obtenerProyectos)
// router.post('/', checkAuth, nuevoProyecto)
router
  .route('/')
  .get(checkAuth, obtenerProyectos)
  .post(checkAuth, nuevoProyecto)

router
  .route('/:id')
  .get(checkAuth, obtenerProyecto)
  .put(checkAuth, editarProyecto)
  .delete(checkAuth, eliminarProyecto)

// la id es del proyecto
router.get('/tareas/:id', checkAuth, obtenerTareas)
router.post('/agregar-colaborador/:id', checkAuth, aregarColaborador)
router.post('/agregar-colaborador/:id', checkAuth, eliminarColaborador,
)


export default router