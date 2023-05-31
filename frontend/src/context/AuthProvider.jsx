import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'


const AuthContext = createContext()

const AuthProvider = ({children}) => {

  return (
    <AuthContext.Provider
      value={{

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