import FormularioProyectos from "../components/FormularioProyectos"

const NuevoProyecto = () => {
  return (
   <div>
    <h1 className='text-4xl font-black' >Crear Proyecto</h1>
   
    <div className='mt-10 flex justify-center'>
        <FormularioProyectos />
    </div>
   
   </div>


  )
}

export default NuevoProyecto