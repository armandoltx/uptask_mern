import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

const obtenerTarea = async (req, res) => {
  const { id } = req.params
  // console.log(id)
  const tarea = await Tarea.findById(id).populate("proyecto")
  console.log(tarea)

  if(!tarea) {
    const error = new Error("Tarea no Econtrada.")
    return res.status(404).json({ msg: error.message })
  }

  if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permiso para ver la Tarea.")
    return res.status(403).json({ msg: error.message })
  }
  res.json(tarea)
}

const nuevaTarea = async (req, res) => {
  // console.log(req.body)
  // nos traemos el id del proyecto
  const { proyecto } =req.body
  // vemos si el proyecto existe
  const existeProyecto = await Proyecto.findById(proyecto)
  // console.log(existeProyecto)
  if(!existeProyecto) {
    const error = new Error("Proyecto no Econtrado.")
    return res.status(404).json({ msg: error.message })
  }
  // La persona q comprueba es la duena del proyecto
  if(existeProyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permiso.")
    return res.status(401).json({ msg: error.message })
  }

  try {
    const tareaAlamcenada = await Tarea.create(req.body)
    // Almacenar el ID en el proyecto
    existeProyecto.tareas.push(tareaAlamcenada._id)
    // lo guarda en memoria, para q lo guarde en BD
    await existeProyecto.save()
    res.json(tareaAlamcenada)
  } catch (error) {
    console.log(error)
  }

}

const editarTarea = async (req, res) => {
  const { id } = req.params
  // console.log(id)
  const tarea = await Tarea.findById(id).populate("proyecto")
  console.log(tarea)

  if(!tarea) {
    const error = new Error("Tarea no Econtrada.")
    return res.status(404).json({ msg: error.message })
  }

  if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permiso para ver la Tarea.")
    return res.status(403).json({ msg: error.message })
  }
  // en react vamos a colocar en el state todos los campos, per aqui no:
  tarea.nombre = req.body.nombre || tarea.nombre
  tarea.descripcion = req.body.descripcion || tarea.descripcion
  tarea.prioridad = req.body.prioridad || tarea.prioridad
  tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega

  try {
    const tareaAlmacenada = await tarea.save()
    res.json(tareaAlmacenada)
  } catch (error) {
    console.log(error)
  }
}

const eliminarTarea = async (req, res) => {
  const { id } = req.params
  // console.log(id)
  const tarea = await Tarea.findById(id).populate("proyecto")
  console.log(tarea)

  if(!tarea) {
    const error = new Error("Tarea no Econtrada.")
    return res.status(404).json({ msg: error.message })
  }

  if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permiso para ver la Tarea.")
    return res.status(403).json({ msg: error.message })
  }
  try {
    const proyecto = await Proyecto.findById(tarea.proyecto)
    proyecto.tareas.pull(tarea._id)

    await Promise.allSettled([wait proyecto.save(), await tarea.deleteOne()])
    // asi se llevan a cabo las 2 ejecuciones al mismo tiempo.

    res.json({ msg: "Tarea Eliminada." })
  } catch (error) {
    console.log(error)
  }
}

const cambiarEstado = async (req, res) => {
  const {id} = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  // q la tarea exista
  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({msg: error.message});
  }

  // q sea creador del proyecto o colaborador
  if (
    tarea.proyecto.creador.toString() !== req.usuario._id.toString() &&
    !tarea.proyecto.colaboradores.some(
      (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    )
  ) {
    const error = new Error("Acción no válida");
    return res.status(403).json({msg: error.message});
  }

  tarea.estado = !tarea.estado;
  tarea.completado = req.usuario._id
  await tarea.save();

  const tareaAlmacenada = await Tarea.findById(id)
    .populate("proyecto")
    .populate("completado")

  res.json(tareaAlmacenada);
}

export {
  obtenerTarea,
  nuevaTarea,
  editarTarea,
  eliminarTarea,
  cambiarEstado
}