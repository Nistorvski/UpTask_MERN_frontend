import { useEffect } from 'react';
import Alerta from '../components/Alerta';
import PreviewProyecto from '../components/PreviewProyecto';
import useProyectos from '../hooks/useProyectos'
import io from 'socket.io-client';

let socket;

const Proyectos = () => {

  const {proyectos, alerta} = useProyectos();
 

  // //*Si el useEffect se deja con las dependencias abajo "..},[]" se escuchará solo una vez y para socket hay que dejarlo sin ellas para que se escuchen todos los cambios que hay, no solo cunado el componente se recarga... Así que este useEffect no tendra el "..},[]" abajo. **Este useEffect con socket.io es solo un ejemplo**
  // // useEffect(()=> {
  // //   socket = io(import.meta.env.VITE_BACKEND_URL);

  // //   socket.emit('prueba');

  // //   socket.on('respuesta', () => {
  // //     console.log('Desde el fontend');
  // //   })

  // // })

  const {msg} = alerta;

  return (
   
    <div>

    <h1 className='text-4xl font-black' >Proyectos</h1>

    { msg && <Alerta alerta={alerta} />}

    <div className='bg-white shadow mt-10 rounded-lg'>
      {proyectos.length  ?
      
        proyectos.map(proyecto => (
          <PreviewProyecto 
            key={proyecto._id}
            proyecto={proyecto} 
            />
        ))
        
      : <p className=' text-center text-gray-600 uppercase p-5'>No hay proyectos aún</p>}
    </div>
   </div>
  )
}

export default Proyectos