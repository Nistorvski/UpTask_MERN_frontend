import { formatearFecha } from "../helpers/formatearFecha";
import useAdmin from "../hooks/useAdmin";
import useProyectos from "../hooks/useProyectos";

const Tarea = ({ tarea }) => {
  const { nombre, descripcion, prioridad, fechaEntrega, estado, _id } = tarea;

  const { handleEditarTarea, handleEliminarTarea, completarTarea } = useProyectos();

  const  admin  = useAdmin();

  return (
    <div className="border-b p-5 flex justify-between items-center">
      <div className="flex flex-col items-start">
        <p className=" mb-1 text-xl ">{nombre}</p>
        <p className=" mb-1 text-sm  mb-1 text-gray-500 uppercase ">
          {descripcion}
        </p>
        <p className=" mb-1 text-sm ">{formatearFecha(fechaEntrega)}</p>
        <p className=" mb-1 text-xl text-gray-600 ">Prioridad: {prioridad}</p>
        { estado && <p className="p-1 text-xs bg-green-600 text-white rounded-lg uppercase " >Completado por: {tarea.completado.nombre}</p>}
      </div>

      <div className="flex flex-col ml-5 lg:flex-row">
       
       { admin && (
          <button 
          className=" mr-3 bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
          onClick={() => handleEditarTarea(tarea)}
  
          >
            Editar
          </button>
       )}

        {estado ? (
          <button className=" mr-3 bg-green-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
          onClick={() => completarTarea(_id)}
          >
            Completa
          </button>
        ) : (
          <button className=" mr-3 bg-gray-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
          onClick={() => completarTarea(_id)}
          >
            Incompleta
          </button>
        )}

      { admin && (
          <button 
          className=" mr-3 bg-red-600 hover:bg-red-700 transition-colors px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
          onClick={() => handleEliminarTarea(tarea)}
          >
            Eliminar
          </button>
      )}

      </div>
    </div>
  );
};

export default Tarea;
