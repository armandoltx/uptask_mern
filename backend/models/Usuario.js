import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const usuarioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  token: {
    type: String,
  },
  confirmado: {
    type: Boolean,
    default: false,
  }
},{
  timestamps: true
})

usuarioSchema.pre('save', async function(next) {
  if(!this.isModified('password')) {
    // Lo q pasa es q podemos actualizar el usuario y si no tenemos este if
    // podria hashear otra vez el password y no queremos q haga eso.
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

usuarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
  // escribimos function declaration para poder usar "this"
  return await bcrypt.compare(passwordFormulario, this.password)
}


const Usuario = mongoose.model("Usuario", usuarioSchema)
export default Usuario