import Usuario from "../models/Usuario.js"
import generarId from "../helpers/generarId.js"
import generarJWT from "../helpers/generarJWT.js"
import { emailRegistro } from '../helpers/email.js'

const registrar = async (req, res) => {
  // console.log(req.body)

  // Evitar los registros duplicados
  const { email } = req.body
  const existeUsuario = await Usuario.findOne({ email }) // ponemos await para q no se vaya a la otra linea hasta q esta no se haya ejecutado
  // console.log("000000")
  // console.log(existeUsuario)

  if(existeUsuario){
    const error = new Error('Usuario ya registrado')
    return res.status(400).json({ msg: error.message })
  }

  try {
    const usuario = new Usuario(req.body)
    usuario.token = generarId()
    // console.log(usuario)
    // const usuarioAlmacenado = await usuario.save()
    // res.json(usuarioAlmacenado)
    await usuario.save()

    // Enviar el email de confirmacion
    // console.log(usuario)
    emailRegistro({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token
    })




    res.json({msg: "Usuario Creado Correctamente, revisa tu email para confirmar tu cuenta."})
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
  if(await usuario.comprobarPassword(password)) {
    // console.log("es correcto")
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id)
    })
  } else {
    // console.log("es incorrecto")
    const error = new Error("El Password es incorrecto")
    return res.status(403).json({ msg: error.message })
  }
}

const confirmar = async (req, res) => {
  // console.log('routing dinamico')
  // console.log(req.params)
  // console.log(req.params.token)
  const { token } = req.params
  const usuarioConfirmar = await Usuario.findOne({ token })
  // console.log(`usuarioConfirmar => ${usuarioConfirmar}`)
  if(!usuarioConfirmar) {
    const error = new Error("Token no Valido")
    return res.status(403).json({ msg: error.message })
  }

  try {
    usuarioConfirmar.confirmado = true
    usuarioConfirmar.token = ""
    await usuarioConfirmar.save()
    // console.log(`usuarioConfirmar => ${usuarioConfirmar}`)
    res.json({msg: "Usuario Confirmado Correctamente"})
  } catch (error) {
    console.log(error)
  }
}

const olvidePassword = async (req, res) => {
  const { email } = req.body
  // Comprobar q el usuario existe
  const usuario = await Usuario.findOne({ email })
  // console.log(`usuario => ${usuario}`)
  if(!usuario) {
    const error = new Error("El Usuario no existe")
    return res.status(404).json({ msg: error.message })
  }

  try {
    usuario.token = generarId()
    // console.log(`usuario => ${usuario}`)
    await usuario.save()
    res.json({msg: "Hemos enviado un email con las instrucciones"})
  } catch (error) {
    console.log(error)
  }
}

const comprobarToken = async (req, res) => {
  const { token } = req.params
  const tokenValido = await Usuario.findOne({ token })

  if(tokenValido) {
    // console.log("token Valido")
    res.json({msg: "Token Valido y el usuario existe."})

  } else {
    // console.log("token NO Valido")
    const error = new Error("Token no valido")
    return res.status(404).json({ msg: error.message })
  }
}

const nuevoPassword = async(req, res) => {
  const { token } = req.params
  const { password } = req.body
  // console.log(`token => ${token}`)
  // console.log(`password => ${password}`)
  // Comprobamos q el token sea valido
  const usuario = await Usuario.findOne({ token })

  if(usuario) {
    // console.log("token Valido")
    // console.log(usuario)
    usuario.password = password
    usuario.token = ''
    try {
      await usuario.save()
      res.json({msg: "Password Modificado Correctamente"})
    } catch (error) {
      console.log(error)
    }
  } else {
    // console.log("token NO Valido")
    const error = new Error("Token no valido")
    return res.status(404).json({ msg: error.message })
  }
}

const perfil = async (req, res) => {
  // console.log('desde perfil')
  const { usuario } = req
  res.json(usuario)
}

export { registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil }