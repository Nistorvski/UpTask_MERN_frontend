import { useState } from "react";
import useProyectos from "../hooks/useProyectos";
import Alerta from "./Alerta";

const FormularioColaborador = () => {
  const [email, setEmail] = useState("");
  const {mostrarAlerta, alerta, submitColaborador} = useProyectos();

  const handleSubmit = e => {
      e.preventDefault();

      if(email === '') {
          mostrarAlerta({
              msg:'El campo email es obligatorio',
              error:true
          })
      }

      submitColaborador(email);
    
  }

  const {msg}=alerta;

  return (
    <form 
    className="bg-white py-10 px-5 md:w-full lg:w-1/2 w-full rounded-lg shadow"
    onSubmit={handleSubmit}
    >

        { msg && <Alerta alerta={alerta} /> }

      <div className="mb-5">
        <label
          htmlFor="email"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Email Colaborador
        </label>

        <input
          onClick={() => mostrarAlerta({})}
          className="border w-full p-2 mt-2 placehorlder-gray-400 rounded-md"
          placeholder="Email del Usuario"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <input
        type="submit"
        value='Buscar Colaborador'
        className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded-lg cursor-pointer hover:bg-sky-700 transition-colors "
      />
    </form>
  );
};

export default FormularioColaborador;
