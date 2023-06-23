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
  const [ tarea, setTarea ] = useState({})
  const [ modalEliminarTarea, setModalEliminarTarea ] = useState(false)
  const [ colaborador, setColaborador] = useState({})
  const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)




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
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
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
    setTarea({})
  }

  const submitTarea = async tarea => {
    // console.log(tarea)
    if(tarea?.id) {
      await editarTarea(tarea)
    } else {
      await crearTarea(tarea)
    }
  }

  const crearTarea = async tarea => {
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

  const editarTarea = async tarea => {
    console.log(tarea)
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
      // console.log(data)

      // Acutalizar el DOM
      // Copiamos el proyecto
      const proyectoActualizado = { ...proyecto }
      // ahora iteramos en las tareas del proyecto
      proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === data._id ? data : tareaState)
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

  const handleModalEliminarTarea = tarea => {
    console.log(tarea)
    setTarea(tarea)
    setModalEliminarTarea(!modalEliminarTarea)
  }

  const eliminarTarea = async (tarea) => {
    console.log("eliminarTarea")
    console.log(tarea)
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
      // console.log(data)
      // la tarea viene de la BD asi q en la url tiene q ser _id
      setAlerta({
        msg: data.msg,
        error: false
      })


      // Acutalizar el DOM
      // Copiamos el proyecto
      const proyectoActualizado = { ...proyecto }
      proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id != tarea._id )

      setProyecto(proyectoActualizado)


      setModalEliminarTarea(false) // reseteamos el formulario
      setTarea({})

    } catch (error) {
      console.log(error)
    }
  }

  const submitColaborador = async email => {
    // console.log(email)
    const token = localStorage.getItem('token')

    setCargando(true)
    try {
      if(!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.post('/proyectos/colaboradores/', {email}, config)
      // console.log(data)
      setColaborador(data)
      setAlerta({})

    } catch (error) {
      console.log(error)
    } finally {
      setCargando(false)
    }
  }

  const agregarColaborador = async email => {
    // console.log(email)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
      const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
      console.log(data)

      setAlerta({
        msg: data.msg,
        error: false
      })
      setColaborador({})

      setTimeout(() => {
        setAlerta({})
      }, 3000);

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const handleModalEliminarColaborador = (colaborador) => {
    setModalEliminarColaborador(!modalEliminarColaborador)
    setColaborador(colaborador)
  }

  const eliminarColaborador = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
      const {data} = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config)

      const proyectoActualizado = {...proyecto}

      proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)

      setProyecto(proyectoActualizado)
      setAlerta({
        msg: data.msg,
        error: false
      })
      setColaborador({})
      setModalEliminarColaborador(false)

      setTimeout(() => {
        setAlerta({})
      }, 3000);

    } catch (error) {
      console.log(error.response)
    }
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
        tarea,
        modalEliminarTarea,
        handleModalEliminarTarea,
        eliminarTarea,
        colaborador,
        submitColaborador,
        agregarColaborador,
        handleModalEliminarColaborador,
        modalEliminarColaborador,
        eliminarColaborador
      }}
    >{children}
    </ProyectosContext.Provider>
  )
}
export {
    ProyectosProvider
}

export default ProyectosContext