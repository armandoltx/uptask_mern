import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'


const AuthContext = createContext()

const AuthProvider = ({children}) => {

  const [ auth, setAuth ] = useState({})
  const [cargando, setCargando] = useState(true)

  const navigate = useNavigate() // para no tener q meter los datos en el formulario todo el tiempo

  useEffect(() => {
    // para comprobar q haya un token en localstorage

    const autenticarUsuario = async () => {
      const token = localStorage.getItem('token')
      // console.log(token)
      // si hay token intentamos autenticar el usuario.
      if(!token) {
        setCargando(false)
        return
      }
      // console.log("hay token")
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      try {
        const { data } = await clienteAxios('/usuarios/perfil', config)
        // console.log(data)
        setAuth(data)
        // navigate('/proyectos')

      } catch (error) {
        setAuth({})
      }
      setCargando(false)

    }

    autenticarUsuario()
  }, [])

  const cerrarSesionAuth = () => {
    setAuth({})
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        cargando,
        cerrarSesionAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { 
  AuthProvider
}

export default AuthContext