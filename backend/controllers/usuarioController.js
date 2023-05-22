import Usuario from "../models/Usuario.js"

const registrar = async (req, res) => {
  // console.log(req.body)
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