import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import FormularioProyecto from '../components/FormularioProyecto'
import useProyectos from '../hooks/useProyectos'


const EditarProyecto = () => {
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
    <>
      <div>
        <h1 className='font-black text-4xl'>Editar Proyecto: {nombre}</h1>
      </div>

      <div className="mt-10 flex justify-center">
        <FormularioProyecto />
      </div>
    </>
  );
};

export default EditarProyecto;