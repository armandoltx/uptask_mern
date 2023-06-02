import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

const obtenerProyectos = async (req, res) => {
  //req.usuario esta creado en el middleware asi q lo podemos usar aqui para el query
  const proyectos = await Proyecto.find().where('creador').equals(req.usuario)
  res.json(proyectos)
}

const nuevoProyecto = async (req, res) => {
  // console.log('nuevoProyecto')
  // console.log(req.body)
  // console.log(req.usuario)
  const proyecto = new Proyecto(req.body)
  proyecto.creador = req.usuario._id

  try {
    const proyectoAlmacenado = await proyecto.save()
    res.json(proyectoAlmacenado)
  } catch (error) {
    console.log(error)
  }
}

const obtenerProyecto = async (req, res) => {
  const { id } = req.params
  // console.log(id)
  // ver si el proyecto existe
  const proyecto = await Proyecto.findById(id)

  // el proyecto exista
  if(!proyecto) {
    const error = new Error("Proyecto no Econtrado.")
    return res.status(404).json({ msg: error.message })
  }

  // es el creador del proyecto
  if(proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permiso para ver el Proyecto.")
    return res.status(401).json({ msg: error.message })
  }

  res.json(
    proyecto,
  )
}

const editarProyecto = async (req, res) => {
  const { id } = req.params
  // console.log(id)
  // ver si el proyecto existe
  const proyecto = await Proyecto.findById(proyecto._id)

  if(!proyecto) {
    const error = new Error("Proyecto no Econtrado.")
    return res.status(404).json({ msg: error.message })
  }

  if(proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permiso para ver el Proyecto.")
    return res.status(401).json({ msg: error.message })
  }
  // en react vamos a colocar en el state todos los campos, per aqui no:
  proyecto.nombre = req.body.nombre || proyecto.nombre
  proyecto.descripcion = req.body.descripcion || proyecto.descripcion
  proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
  proyecto.cliente = req.body.cliente || proyecto.cliente

  try {
    const proyectoAlmacenado = await proyecto.save()
    res.json(proyectoAlmacenado)
  } catch (error) {
    console.log(error)
  }
}

const eliminarProyecto = async (req, res) => {
  const { id } = req.params
  // console.log(id)
  // ver si el proyecto existe
  const proyecto = await Proyecto.findById(id)

  if(!proyecto) {
    const error = new Error("Proyecto no Econtrado.")
    return res.status(404).json({ msg: error.message })
  }

  if(proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permiso para ver el Proyecto.")
    return res.status(401).json({ msg: error.message })
  }

  try {
    await proyecto.deleteOne()
    res.json({ msg: "Proyecto Eliminado." })
  } catch (error) {
    console.log(error)
  }
}

const aregarColaborador = async (req, res) => {}

const eliminarColaborador = async (req, res) => {}

const obtenerTareas = async (req, res) => {
  const { id } = req.params
  const existeProyecto = await Proyecto.findById(id)
  if(!existeProyecto) {
    const error = new Error("No Encontrado")
    return res.status(404).json({ msg: error.message })
  }

  // Tienes q ser el creador o el colaborador del proyecto
  const tareas = await Tarea.find().where("proyecto").equals(id)
  res.json(tareas)

  // pero es mejor obtener las tareas por proyecto, lo haremos en obtenerProyecto, se puede borrar todo lo relativo a esta accion
}

export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  aregarColaborador,
  eliminarColaborador,
  obtenerTareas
}