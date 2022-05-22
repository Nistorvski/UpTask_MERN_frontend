import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import ModalEliminarTarea from "../components/ModalEliminarTarea";
import ModalFormularioTarea from "../components/ModalFormularioTarea";
import ModalEliminarColaborador from "../components/ModalEliminarColaborador";
import Tarea from "../components/Tarea";
import useProyectos from "../hooks/useProyectos";
import Alerta from "../components/Alerta";
import Colaborador from "../components/Colaborador";
import useAdmin from "../hooks/useAdmin";

const Proyecto = () => {

  const params = useParams();

  const {proyecto, cargando, obtenerProyecto, handleModalTarea, setAlerta, alerta} = useProyectos(); 

   const admin = useAdmin();

  
    useEffect(() => {
        obtenerProyecto(params.id);
    },[])

    const { nombre } = proyecto
   // console.log(proyecto);

    if(cargando){
        return 'Cargando...'
    }

    const { msg } = alerta;

    return (
        
      
        
    <>
        <div className="flex justify-between">
        
             <h1 className="font-black text-4xl">{nombre}</h1>

          {admin && (
                 <div className="flex items-center text-gray-400 hover:text-black transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                 </svg>
                 <Link 
                 className="ml-2 uppercase font-bold"  
                 to={`/proyectos/editar/${params.id}`} >Editar
                 </Link>
              </div>
          )}
        
        </div>

            {admin && (
                   <button
                   type="button"
                   onClick={handleModalTarea}
                   className="text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex items-center justify-center"
               >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                   </svg>
                   Nueva Tarea
               </button>
       
            )}

        <p className="font-bold text-xl mt-10" >Tareas del Proyecto</p>


        <div className="bg-white shadow mt-10 rounded-ld">
            {proyecto.tareas?.length ? 
                proyecto.tareas?.map( tarea => (
                    <Tarea 
                        key={tarea._id}
                        tarea={tarea}
                    />
                ))
                
            :
                <p className="text-center my5 p-10" > No hay tareas</p>
            }
        </div>

            {admin && (
                <>
                            <div className="flex items-center justify-between ">
            <p className="font-bold text-xl mt-10">Colaboradores</p>
            <Link
                to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                className='text-gray-400 hover:text-black transition-colors uppercase font-bold'
            >
            Añadir</Link>
        </div>

        <div className="bg-white shadow mt-10 rounded-ld">
            {proyecto.colaboradores?.length ? 
                proyecto.colaboradores?.map( colaborador => (
                    <Colaborador 
                        key={colaborador._id}
                        colaborador={colaborador}
                    />
                ))
                
            :
                <p className="text-center my5 p-10" > No hay colaboradores para este proyecto</p>
            }
        </div>
                </>
            )}

        <ModalFormularioTarea />
        <ModalEliminarTarea />
        <ModalEliminarColaborador />

    </>
    
  )
}

export default Proyecto