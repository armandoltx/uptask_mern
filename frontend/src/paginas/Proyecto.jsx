import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'

const Proyecto = () => {
  const params = useParams()
  // console.log(params)
  // hay q pasar el id q viene de params al provider
  // importamos useProyectos, y traemos la funcion obtenerProyecto
  // usamos el  useEffect para comprobar los cambios
  const { obtenerProyecto, proyecto, cargando } = useProyectos()

  useEffect( () => {
    obtenerProyecto(params.id)
  }, [])

  // console.log(proyecto)
  const { nombre } = proyecto

  if(cargando) return 'Cargando...'

  return (
    <div className='flex justify-between'>
      <h1 className='font-black text-4xl'>{nombre}</h1>
      <div className='flex items-center gap-2 text-gray-400 hover:text-black'>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <Link
          to={`/proyectos/editar/${params.id}`}
          className='uppercase font-bold'
        >Editar</Link>
      </div>
    </div>
  )
};

export default Proyecto;