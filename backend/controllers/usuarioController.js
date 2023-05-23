import Usuario from "../models/Usuario.js"
import generarId from "../helpers/generarId.js"

const registrar = async (req, res) => {
  // console.log(req.body)

  // Evitar los registros duplicados
  const { email } = req.body
  const existeUsuario = await Usuario.findOne({ email }) // ponemos await para q no se vaya a la otra linea hasta q esta no se haya ejecutado

  if(existeUsuario){
    const error = new Error('Usuario ya registrado')
    return res.status(400).json({ msg: error.message })
  }

  try {
    const usuario = new Usuario(req.body)
    usuario.token = generarId()
    // console.log(usuario)
    const usuarioAlmacenado = await usuario.save()
    res.json(usuarioAlmacenado)
  } catch (error) {
    console.log(error)
  }
}

const autenticar = async (req, res) => {
  const { email, password } = req.body
  // Comprobar q el usuario existe
  const usuario = await Usuario.findOne({ email })
  // console.log(`usuario => ${usuario}`)
  if(!usuario) {
    const error = new Error("El Usuario no existe")
    return res.status(404).json({ msg: error.message })
  }

  // Comprobar q el usuario esta confirmado
  if(!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada")
    return res.status(403).json({ msg: error.message })
  }

  // Comprobar el password
}


export { registrar, autenticar }