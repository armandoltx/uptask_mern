import Usuario from "../models/Usuario.js"

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
    // console.log(usuario)
    const usuarioAlmacenado = await usuario.save()
    res.json(usuarioAlmacenado)
  } catch (error) {
    console.log(error)
  }
}

export { registrar }