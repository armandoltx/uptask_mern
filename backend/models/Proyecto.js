import mongoose from 'mongoose'

const proyectoSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  fechaEntrega: {
    type: Date,
    default: Date.now(),
  },
  cliente: {
    type: String,
    required: true,
    trim: true
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario"
  },
  tareas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tarea" // como sea el nombre en el modelo
    }
  ],
  colaboradores: [ // es un rreglo de usuarios
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario"
    }
  ],
},{
  timestamps: true
})

const Proyecto = mongoose.model("Proyecto", proyectoSchema)
export default Proyecto