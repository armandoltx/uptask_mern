import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'


const AuthContext = createContext()

const AuthProvider = ({children}) => {
  const [hola, setHola] = useState("holaaaa")

  return (
    <AuthContext.Provider
      value={{
        hola

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