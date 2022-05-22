import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useProyectos from '../hooks/useProyectos';
import Alerta from './Alerta';


const FormularioProyectos = () => {

    const [id, setId] = useState(null);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaEntrega, setFechaEntrefa] = useState('');
    const [cliente, setCliente] = useState('');

    const { mostrarAlerta, alerta, submitProyecto, proyecto }= useProyectos();

    const params = useParams();
    
    
    useEffect(() => {
        if(params.id){
            
            setId(proyecto._id);
            setNombre(proyecto.nombre);
            setDescripcion(proyecto.descripcion);
            setFechaEntrefa(proyecto.fechaEntrega?.split('T')[0]),
            setCliente(proyecto.cliente);

        }
    }, [params])

    const handleSubmit = async e => {
        e.preventDefault();

       

        if([nombre, descripcion, fechaEntrega, cliente].includes('') && mostrarAlerta){
            mostrarAlerta({
                msg:'Todos los campos son obligatorios',
                error:true
            })

          return
        }

        //Pasar los datos hacia el provider

       await submitProyecto({ id, nombre, descripcion, fechaEntrega, cliente})
        

       setId(null)
       setNombre('')
       setDescripcion('');
       setFechaEntrefa('');
       setCliente('');
    }

    const { msg } = alerta;

    
    return (
    <form 
        className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"    
        onSubmit={handleSubmit}
    >   

        {msg && <Alerta alerta={alerta} />}
   
        <div className="mb-5">
            <label 
            htmlFor="nombre"
            className="text-gray-700 uppercase font-bold text-sm"
            >Nombre Proyecto</label>

            <input 
            className="border w-full p-2 mt-2 placehorlder-gray-400 rounded-md"
            placeholder="Nombre del Proyecto" 
            type="text" 
            id="nombre" 
            value={nombre}
            onChange={ e => setNombre(e.target.value)}
            
            />
        </div>

        <div className="mb-5">
            <label 
            htmlFor="descripcion"
            className="text-gray-700 uppercase font-bold text-sm"
            >Descripcion Proyecto</label>

            <textarea 
            className="border w-full p-2 mt-2 placehorlder-gray-400 rounded-md"
            placeholder="Descripcion del Proyecto"  
            id="descripcion" 
            value={descripcion}
            onChange={ e => setDescripcion(e.target.value)}
            
            />
        </div>

        <div className="mb-5">
            <label 
            htmlFor="fecha-entrega"
            className="text-gray-700 uppercase font-bold text-sm"
            >Fecha Entrega</label>

            <input 
            className="border w-full p-2 mt-2 placehorlder-gray-400 rounded-md"
            type="date" 
            id="fecha-entrega" 
            value={fechaEntrega}
            onChange={ e => setFechaEntrefa(e.target.value)}
            
            />
        </div>

        <div className="mb-5">
            <label 
            htmlFor="cliente"
            className="text-gray-700 uppercase font-bold text-sm"
            >Cliente del Proyecto</label>

            <input 
            className="border w-full p-2 mt-2 placehorlder-gray-400 rounded-md"
            placeholder="Cliente del Proyecto" 
            type="text" 
            id="cliente" 
            value={cliente}
            onChange={ e => setCliente(e.target.value)}
            
            />
        </div>

        <input 
        type="submit" 
        value={id ? 'Actualizar Rpoyecto' : 'Crear Proyecto'}
        className='bg-sky-600 w-full p-3 uppercase font-bold text-white rounded-lg cursor-pointer hover:bg-sky-700 transition-colors '
        />


    </form>
  )
}

export default FormularioProyectos