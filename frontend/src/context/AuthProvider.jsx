import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'


const AuthContext = createContext()

const AuthProvider = ({children}) => {

  const [ auth, setAuth ] = useState({})
  useEffect(() => {
    // para comprobar q haya un token en localstorage

    const autenticarUsuario = async () => {
      const token = localStorage.getItem('token')
      // console.log(token)
      // si hay token intentamos autenticar el usuario.
      if(!token) return
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
      } catch (error) {

      }

    }

    autenticarUsuario()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth
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