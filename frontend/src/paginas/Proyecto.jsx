import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos';

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


  return (
    cargando ? 'cargando...' : (
      <div className='flex justify-between'>
        <h1 className='font-black text-4xl'>{nombre}</h1>
      </div>
    )
  );
};

export default Proyecto;