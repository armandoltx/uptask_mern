import { useEffect } from 'react'
import useProyectos from "../hooks/useProyectos"
import PreviewProyecto from "../components/PreviewProyecto"
import Alerta from "../components/Alerta"
import io from 'socket.io-client'

let socket;

const Proyectos = () => {
  const {proyectos, alerta } = useProyectos()
  // console.log(`proyectos => ${proyectos}`)
  // console.log(proyectos)
  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL)
    // mandar datos al backend
    socket.emit('prueba', proyectos)

    // recibir datos desde el backend
    socket.on('respuesta', (nombre) => {
      console.log('recibida la respuesta desde el backend print en frontend', nombre)
    })
  }) // hay q quitarle las dependencias para q escuche cada vez q haga cambios

  const {msg} = alerta



  return (
    <>
      <h1 className="text-4xl font-black">Proyectos</h1>
      {msg && <Alerta alerta={alerta} />}

      <div className="bg-white shadow mt-10 rounded-lg">
        {
          proyectos.length ?
            proyectos.map(proyecto => (
              <PreviewProyecto
                key={proyecto._id}
                proyecto={proyecto}
              />
              ))
          : <p className=" text-center text-gray-600 uppercase  p-5">No hay proyectos aún</p>
        }
      </div>
    </>
  );
};

export default Proyectos;