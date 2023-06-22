import { useEffect } from 'react'
import FormularioColaborador from "../components/FormularioColaborador"
import useProyectos from '../hooks/useProyectos'
import { useParams } from 'react-router-dom'

const NuevoColaborador = () => {
  const { obtenerProyecto, proyecto, cargando } = useProyectos()
  const params = useParams()

  useEffect(() => {
    obtenerProyecto(params.id)
  }, []);


  return (
    <>
      <h1 className="text-4xl font-black">Añadir Colaborador(a) al Proyecto: {proyecto.nombre}</h1>

      <div className="mt-10 flex justify-center">
        <FormularioColaborador />
      </div>
    </>
  );
};

export default NuevoColaborador;