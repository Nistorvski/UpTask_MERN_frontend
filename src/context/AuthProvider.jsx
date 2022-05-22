import { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../config/clienteAxios';

const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({});
    const [cargando, setCargando] = useState(true);
    
    const navigate = useNavigate();


    useEffect(() => {

        const autenticarUsuario=  async () => {

            const token = localStorage.getItem('token');
            
            if(!token){
                setCargando(false)
                return
            }


            //*Como esta peticion se va a hacer para el endpoint de /perfil que necesita el token se le va a sacar de esta configuracion de abajo, igual como  "Bearer Token" que pusimos en Authentication del Postman
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            
            try{

                const {data} = await clienteAxios('/usuarios/perfil', config);

                setAuth(data);

                //navigate('/proyectos')

            }catch(error){
                console.log(error)
            }finally{
                setCargando(false);
            }
            
        }
        autenticarUsuario()

    },[])
    
    return(

        <AuthContext.Provider
            value={{
                auth,
                cargando,
                setAuth
            }}
        >
             {children}
        </AuthContext.Provider>
    )
}

export{ 
    AuthProvider
}

export default AuthContext;