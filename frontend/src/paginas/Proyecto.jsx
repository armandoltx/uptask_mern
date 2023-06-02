import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos';

const Proyecto = () => {
  const params = useParams()
  // console.log(params)
  // hay q pasar el id q viene de params al provider
  // importamos useProyectos, y traemos la funcion obtenerProyecto
  // usamos el  useEffect para comprobar los cambios
  const { obtenerProyecto } = useProyectos()

  useEffect( () => {
    obtenerProyecto(params.id)
  }, [])

  return (
    <div>
      Proyecto
    </div>
  );
};

export default Proyecto;