import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Alerta from '../components/Alerta'

const NuevoPassword = () => {
  const [tokenValido, setTokenValido] = useState(false)
  const [alerta, setAlerta] = useState({})

  const params = useParams()
  // console.log(params)
  const { token } = params

  useEffect(() => {
    const comprobarToken = async () => {
      try {
        await axios(`http://localhost:4000/api/usuarios/olvide-password/${token}`)
        setTokenValido(true)
      } catch (error) {
        console.log(error.response)
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    comprobarToken()
  }, [])

  const { msg } = alerta

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Reestablece tu password y no pierdas acceso a tus {''}
          <span className="text-slate-700">proyectos</span>
      </h1>
      {msg && <Alerta alerta={alerta} />}

      { tokenValido && (
        <form className="my-10 bg-white shadow rounded-lg p-10">
          <div className="my-5">
            <label
              className="uppercase text-gray-600 block text-xl font-bold"
              htmlFor="password"
            >Nuevo Password</label>
            <input
              id="password"
              type="password"
              placeholder="Escribe tu Nuevo Password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            />
          </div>
          <input
            type="submit"
            value="Guardar Nuevo Password"
            className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
          />
        </form>
      )}

    <Link
      className='block text-center my-5 text-slate-500 uppercase text-sm'
      to="/"
    >Inicia Sesión</Link>
    </>
)
};

export default NuevoPassword;