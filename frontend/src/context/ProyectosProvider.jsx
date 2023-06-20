import { useState, useEffect, createContext } from 'react'
import clienteAxios from '../config/clienteAxios'
import { useNavigate } from 'react-router-dom'


const ProyectosContext = createContext()

const ProyectosProvider = ({children}) => {
  const [proyectos, setProyectos] = useState([])
  const [alerta, setAlerta] = useState({})
  const [proyecto, setProyecto] = useState({})
  const [cargando, setCargando] = useState(false)
  const [ modalFormularioTarea, setModalFormularioTarea ] = useState(false)
  const [tarea, setTarea] = useState({})


  const navigate = useNavigate();

  // Una vez listo el componente de Proyectos nos traemos los proyectos de la API
  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        const token = localStorage.getItem('token')
        if(!token) return

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
        const { data } = await clienteAxios('/proyectos', config)
        // console.log(data)
        setProyectos(data)

      } catch (error) {
        console.log(error)
      }
    }
    obtenerProyectos()
  }, [])

  const mostrarAlerta = alerta => {
    setAlerta(alerta)

    setTimeout(() => {
      setAlerta({})
    }, 5000)
  }

  const submitProyecto = async proyecto => {
    // console.log(proyecto)
    if(proyecto.id) {
      await editarProyecto(proyecto)
    } else {
      await nuevoProyecto(proyecto)
    }
  }

  const editarProyecto = async proyecto => {
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
      // console.log('put')
      // console.log(data)

      // Sincronizar el state
      // proyectoState es el proyecto q esta en memoria
      const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
      setProyectos(proyectosActualizados)

      // Mostrar alerta
      setAlerta({
        msg: 'Proyecto Actualizado Correctamente',
        error: false
      })
      // redireccionar
      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
    }, 3000);

    } catch (error) {
      console.log(error)
    }
  }

  const nuevoProyecto = async proyecto => {
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios.post('/proyectos', proyecto, config)
      // console.log(data)
      setProyectos([...proyectos, data]) // Para mostrar el proyecto nuevo sin necesidad de refrescar el browser

      setAlerta({
        msg: 'Proyecto Creado Correctamente',
        error: false
      })

      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 3000);

    } catch (error) {
        console.log(error)
    }
}

  // para obtener el proyecto q vamos a renderizar en la pagina de proyecto
  // usaremos la id q viene de Proyecto y la BD.
  const obtenerProyecto = async id => {
    // console.log(`id => ${id}`)
    setCargando(true)

    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios(`/proyectos/${id}`, config )
      // console.log(data)
      setProyecto(data)

    } catch (error) {
      console.log(error)
    } finally {
      setCargando(false)
    }
  }

  const eliminarProyecto = async id => {
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)

      // Sincronizar el state
      const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id )
      setProyectos(proyectosActualizados)

      setAlerta({
        msg: data.msg,
        error: false
      })

      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 3000);
    } catch (error) {
        console.log(error)
    }
  }

  const handleModalTarea = () => {
    setModalFormularioTarea(!modalFormularioTarea)
  }

  const submitTarea = async tarea => {
    // console.log(tarea)

    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios.post('/tareas', tarea, config)
      console.log(data)
      // Agrega la tarea al state
      const proyectoActualizado = { ...proyecto }
      proyectoActualizado.tareas = [...proyecto.tareas, data]
      setProyecto(proyectoActualizado)
      setAlerta({}) // reseteamos alerta
      setModalFormularioTarea(false) // reseteamos el formulario
    } catch (error) {
      console.log(error)
    }

  }

  const handleModalEditarTarea = tarea => {
    // console.log(tarea)
    setTarea(tarea)
    setModalFormularioTarea(true)
  }

  return(
    <ProyectosContext.Provider
      value={{
        proyectos,
        alerta,
        mostrarAlerta,
        submitProyecto,
        obtenerProyecto,
        proyecto,
        cargando,
        eliminarProyecto,
        modalFormularioTarea,
        handleModalTarea,
        submitTarea,
        handleModalEditarTarea,
        tarea
      }}
    >{children}
    </ProyectosContext.Provider>
  )
}
export {
    ProyectosProvider
}

export default ProyectosContext