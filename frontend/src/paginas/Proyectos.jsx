import useProyectos from "../hooks/useProyectos"

const Proyectos = () => {
  const { proyectos } = useProyectos()
  // console.log(`proyectos => ${proyectos}`)
  // console.log(proyectos)


  return (
    <>
      <h1 className="text-4xl font-black">Proyectos</h1>
    </>
  );
};

export default Proyectos;