import { useState, useEffect, createContext} from 'react';
import clienteAxios from '../config/clienteAxios';
import { useNavigate } from 'react-router-dom';
import io  from 'socket.io-client';
import useAuth from '../hooks/useAuth';

let socket;

const ProyectosContext = createContext();

const ProyectosProvider = ({children}) => {

    const [ tarea, setTarea] = useState({});
    const [ alerta, setAlerta] = useState({});
    const [ proyecto, setProyecto ] = useState({});
    const [ proyectos, setProyectos ] = useState([]);
    const [ buscador, setBuscador ] =useState(false);
    const [ cargando, setCargando ] = useState(false);
    const [ colaborador, setColaborador ] = useState({}) 
    const [ modalEliminarTarea, setModalEliminarTarea] = useState(false);
    const [ modalFormularioTarea, setModalFormularioTarea ] = useState(false);
    const [ modalEliminarColaborador, setModalEliminarColaborador ] = useState(false)

    const navigate = useNavigate();

    const { auth } = useAuth();




    useEffect(() => {

     const obtenerProyectos = async () => {
        try{    
            const token = localStorage.getItem('token');

            if(!token) return

            const config = {
                headers: {
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios('/proyectos', config);
            
            setProyectos(data);


        }catch(error){
            console.log(error);
        }
     }

     obtenerProyectos();

    }, [auth])


    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL);
    },[])


    const mostrarAlerta = (alerta) => {
        setAlerta(alerta);

        setTimeout(() => {
            setAlerta({})
        }, 5000);

    }

    const submitProyecto = async (proyecto) => {  
       try{
           
        if(proyecto.id){
           await editarProyecto(proyecto);
        }else{
           await nuevoProyecto(proyecto);
        }

       }catch(error){
           console.log(error);
       }

    }

    const editarProyecto = async (proyecto) => {
        try{
            const token = localStorage.getItem('token');

            if(!token) return

            const config = {
                headers: {
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data} = await clienteAxios.put(`/proyectos/${proyecto.id}`,proyecto, config);
            
            //Sincronizar el state

            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id  === data._id ? data : proyectoState)

            setProyectos(proyectosActualizados);

            //Mostrar la alerta

            setAlerta({
                msg:'Proyecto actualizado correctamente',
                error:false
            })

            setTimeout(()=> {
                setAlerta({}),
                navigate('/proyectos')
            },1000)





        }catch(error){
            console.log(error);
        }
    }

    const nuevoProyecto = async (proyecto) => {
        try{
            const token = localStorage.getItem('token');

            if(!token) return

            const config = {
                headers: {
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }
             
            const { data } = await clienteAxios.post('/proyectos', proyecto, config);

            setProyectos([...proyectos, data]);

            setAlerta({
                msg:'Proyecto creado correctamente',
                error:false
            })

            setTimeout(()=> {
                setAlerta({}),
                navigate('/proyectos')
            },1000)

        }catch(error){
            console.log(error);
        }
    }

    const obtenerProyecto = async (id) => {
        setCargando(true)
       try{
        const token = localStorage.getItem('token');

        if(!token) return

        const config = {
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            }
        }
         
        const { data } = await clienteAxios(`/proyectos/${id}`, config);
            setProyecto(data);

       }catch(error){

        setAlerta({
            msg:error.response.data.msg,
            error:true
        })
        setTimeout(() => {
            setAlerta({})
        }, 2000)
       }finally{
           setCargando(false)
       }
    }

    const eliminarProyecto = async (id) => {
       try{

        const token = localStorage.getItem('token');

        if(!token) return

        const config = {
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            }
        }
         
        const { data } = await clienteAxios.delete(`/proyectos/${id}`, config);

        //Sincroniar state
        const proyectoActualizado = proyectos.filter(proyectoState => proyectoState._id !== id)
        setProyectos(proyectoActualizado)

        //Mensaje de alerta
        setAlerta({
            msg:data.msg,
            error:false
        });

        setTimeout(()=> {
            setAlerta({}),
            navigate('/proyectos')
        },1000);

       }catch(error){
           console.log(error)
       }
    }


    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({});
    }

    const submitTarea = async tarea => {

        if(tarea?.id){
            await editarTarea(tarea);
        }else{
            await crearTarea(tarea);
        }

    }

    const crearTarea = async (tarea) => {
        try{
            const token = localStorage.getItem('token');

            if(!token) return
    
            const config = {
                headers: {
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.post('/tareas', tarea, config);

       
          setAlerta({})
          setModalFormularioTarea(false)

          //SOCKET IO

          socket.emit('nueva tarea', data);

        }catch(error){
            console.log(error);
        }
    }

    const editarTarea = async tarea => {
        try{
            const token = localStorage.getItem('token');

            if(!token) return
    
            const config = {
                headers: {
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)

           

            //Quitar las alertas y cerrar el modal
            setAlerta({})
            setModalFormularioTarea(false)

            //Socket    
            socket.emit('actualizar tarea', data);

        }catch(error){
            console.log(error);
        }
    }

    const handleEditarTarea = tarea => {
        setTarea(tarea);
        setModalFormularioTarea(true);
    }

    const handleEliminarTarea = tarea => {
        setTarea(tarea);
        setModalEliminarTarea(!modalEliminarTarea);
    } 

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token');

            if(!token) return
    
            const config = {
                headers: {
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            //*En este caso del 'delete' la url no es solamente .id como en el caso de 'edit' sino que es ._id ya que este dato lo extraemos de la base de datos
            const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`, config)

            setAlerta({
                msg:data.msg,
                error:false
            });

           
            setModalEliminarTarea(false)

            //Soket io
            socket.emit('eliminar tarea', tarea)


            setTarea({})
           setTimeout(() => {
            setAlerta({});
           },2000)

        } catch (error) {
            console.log(error)
        }
    }

    const submitColaborador = async email => {
        setCargando(true);
        try {
            const token = localStorage.getItem('token');

            if(!token) return
    
            const config = {
                headers: {
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/proyectos/colaboradores', {email}, config);

            setColaborador(data);
            setAlerta({})
            
        } catch (error) {
            setAlerta({
                msg:error.response.data.msg,
                error:true
            })
        }finally{
            setCargando(false)
        }
    }

    const agregarColaborador = async email => {
       try {
        const token = localStorage.getItem('token');

        if(!token) return

        const config = {
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            }
        }

        const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config);

        setAlerta({
            msg:data.msg,
            error:false
        });
        setColaborador({});

       setTimeout(()=> {
        setAlerta({});
        navigate('/proyectos')
       },2000)


       } catch (error) {
        setAlerta({
            msg:error.response.data.msg,
            error:true
        })
        setTimeout(()=> {
            setAlerta({});
            navigate('/proyectos')
           },1500)
       }
    }

    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador);

        setColaborador(colaborador);

    }

    const eliminarColaborador = async () => {
       try {

        const token = localStorage.getItem('token');

        if(!token) return

        const config = {
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            }
        }


        const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config);

            const proyectoActualizado = {...proyecto}
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradoresState => colaboradoresState._id !== colaborador._id)

            setProyecto(proyectoActualizado)

           setAlerta({
               msg:data.msg,
               error:false
           })

           setColaborador({})
           setModalEliminarColaborador(false);
          
           setTimeout(()=> {
            setAlerta({});
           },2000)

       } catch (error) {
           console.log(error.response.data.msg)
       }
    }

    const completarTarea = async (id) => {
       try {
        const token = localStorage.getItem('token');

        if(!token) return

        const config = {
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            }
        }

        const { data } = await clienteAxios.post(`/tareas/estado/${id}`,{}, config);
      
       setTarea({})
       setAlerta({})

       //Socket.io
       socket.emit('cambiar estado', data);

       } catch (error) {
           console.log(error)
       }
    }

    const handleBuscador = () => {
        setBuscador(!buscador);
    }

//SOCKET IO
    const submitTareasProyecto= (tarea) => {
           //Agrgar la tarea al state
           const proyecoActualizado = { ...proyecto }
           proyecoActualizado.tareas = [ ...proyecoActualizado.tareas, tarea ]
           setProyecto(proyecoActualizado)
    }
    const eliminarTareaProyecto = tarea => {
               //*Actualizar el Dom
               const proyectoActualizado = {...proyecto}
               proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id )
               setProyecto(proyectoActualizado)   
    }
    const actualizarTareaProyecto = tarea => {
         //*Actualizar el Dom
         const proyectoActualizado = {...proyecto}
         proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
         setProyecto(proyectoActualizado)
    }

    const cambiarEstadoTarea = tarea => {
        const proyectoActualizado = {...proyecto}

        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState )
        setProyecto(proyectoActualizado)
    }

    const cerrarSesionProyectos = () => {
        setProyectos([]);
        setProyecto({});
        setAlerta({})
    }

    return(
        <ProyectosContext.Provider
            value={{
                tarea,
                alerta,
                buscador,
                proyecto,
                cargando,
                proyectos,
                colaborador,
                modalEliminarTarea,
                modalFormularioTarea,
                modalEliminarColaborador,
                submitTarea,
                mostrarAlerta,
                eliminarTarea,
                handleBuscador,
                completarTarea,
                submitProyecto,
                obtenerProyecto,
                eliminarProyecto,
                handleModalTarea,
                submitColaborador,
                handleEditarTarea,
                agregarColaborador,
                cambiarEstadoTarea,
                handleEliminarTarea,
                eliminarColaborador,
                submitTareasProyecto,
                cerrarSesionProyectos,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                handleModalEliminarColaborador,

            }}
        >
            {children}
        </ProyectosContext.Provider>
    )

}

export {
     ProyectosProvider
}

export default ProyectosContext;

