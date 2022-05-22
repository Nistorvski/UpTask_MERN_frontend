import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos';
import Busqueda from './Busqueda';

const Header = () => {

    const navigate = useNavigate();

    const { handleBuscador } = useProyectos();

    const handleSingOut = () => {
        localStorage.setItem('token', '');
        navigate('/')
    }


  return (
    <header className='px-4 py-5 bg-white border-b'>

        <div className='md:flex md:justify-between'>
            <h2 className='text-4xl text-sky-600 font-black text-center mb-5 md:mb-0'>
                <Link to='/proyectos' >UpTask</Link>
            </h2>

           

            <div className='flex flex-col md:flex-row items-center '>
                <button
                    type='button'
                    className='font-bold uppercase mr-5'
                    onClick={handleBuscador}
                >Buscar Proyecto</button>
                <Link
                    to='/proyectos'
                    className='font-bold mr-5 uppercase'
                >Proyectos</Link>

                <button 
                    type='button'
                    className='text-white text-sm bg-sky-600 p-3 rounded-ms uppercase font-bold ml-5 rounded-lg'
                    onClick={handleSingOut}
                >
                    Cerrar Sesión
                </button>

                <Busqueda />

            </div>

           

        </div>

    </header>
  )
}

export default Header