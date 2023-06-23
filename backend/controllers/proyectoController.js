import Proyecto from "../models/Proyecto.js";
import Usuario from "../models/Usuario.js";


const obtenerProyectos = async (req, res) => {
  //req.usuario esta creado en el middleware asi q lo podemos usar aqui para el query
  const proyectos = await Proyecto.find({
    '$or' : [
      {'colaboradores': {$in: req.usuario}},
      {'creador': {$in: req.usuario}}
    ]
  })
    .select('-tareas')
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
    .populate({
      path: "tareas",
      populate: {path: "completado", select: "nombre"},
    })
    .populate("colaboradores", "nombre email");

  // el proyecto exista
  if(!proyecto) {
    const error = new Error("Proyecto no Econtrado.")
    return res.status(404).json({ msg: error.message })
  }

  // es el creador del proyecto o colaborador
  if(proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some(colaborador => colaborador._id.toString()) === req.usuario._id.toString()) {
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
  const proyecto = await Proyecto.findById(id)

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

const buscarColaborador = async (req, res) => {
  // console.log(req.body)
  const {email} = req.body

  const usuario = await Usuario.findOne({ email }).select(
    "-confirmado -createdAt -password -token -updatedAt -__v "
  );

  if(!usuario) {
    const error = new Error('Usuario no encontrado')
    return res.status(404).json({msg: error.message})
  }

  res.json(usuario)
}

const aregarColaborador = async (req, res) => {
  // console.log(req.params.id)
  const proyecto = await Proyecto.findById(req.params.id)

  if (!proyecto) {
    const error = new Error("Proyecto No Encontrado");
    return res.status(404).json({msg: error.message});
  }

  // es el creador del proyecto
  if(proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes permiso para agregar al Proyecto.")
    return res.status(401).json({msg: error.message})
  }

  // console.log(req.body)
  // confirmar q el usuario existe
  if(!usuario) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({msg: error.message});
  }

  // El colaborador no es el admin del proyecto
  if(proyecto.creador.toString() === usuario._id.toString()) {
    const error = new Error("El Creador del Proyecto no puede ser colaborador");
    return res.status(404).json({msg: error.message});
  }

  // Revisar que no este ya agregado al proyecto
  if(proyecto.colaboradores.includes(usuario._id)) {
    const error = new Error("El Usuario ya pertenece al Proyecto");
    return res.status(404).json({msg: error.message});
  }

  // Esta bien, se puede agregar
  proyecto.colaboradores.push(usuario._id);
  await proyecto.save();
  res.json({msg: "Colaborador Agregado Correctamente"});
}

const eliminarColaborador = async (req, res) => {
  const proyecto = await Proyecto.findById(req.params.id);

  if (!proyecto) {
    const error = new Error("Proyecto No Encontrado");
    return res.status(404).json({msg: error.message});
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(404).json({msg: error.message});
  }

  // Esta bien, se puede eliminar
  proyecto.colaboradores.pull(req.body.id);
  await proyecto.save();
  res.json({msg: "Colaborador Eliminado Correctamente"});
}

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
  buscarColaborador,
  aregarColaborador,
  eliminarColaborador,
  obtenerTareas
}