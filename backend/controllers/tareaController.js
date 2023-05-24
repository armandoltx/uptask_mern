import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

const obtenerTarea = async (req, res) => {}
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
    res.json(tareaAlamcenada)
  } catch (error) {
    console.log(error)
  }

}
const editarTarea = async (req, res) => {}
const eliminarTarea = async (req, res) => {}
const cambiarEstado = async (req, res) => {}

export {
  obtenerTarea,
  nuevaTarea,
  editarTarea,
  eliminarTarea,
  cambiarEstado
}