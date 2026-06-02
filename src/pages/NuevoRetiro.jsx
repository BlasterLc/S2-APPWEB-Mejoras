import { useState } from "react";
import Stepper from "../components/Flujo/Stepper";
import StepOperador from "../components/Flujo/StepOperador";
import StepCliente from "../components/Flujo/StepCliente";

function NuevoRetiro() {

const [paso, setPaso] = useState(1);

  const [formulario, setFormulario] = useState({

    operador: "",
    sucursal: "",

    cliente: "",

    tipoDocumento: "",
    numeroDocumento: "",

    documentoVigente: false,

    tipoRetiro: "",

    tercero: "",
    autorizacion: false,

    producto: null
  });

  return (
    <div className="retiro-container">

      <Stepper paso={paso} />

      {paso === 1 && (
        <StepOperador
          formulario={formulario}
          setFormulario={setFormulario}
        />
      )}

      {paso === 2 && (
        <StepCliente
          formulario={formulario}
          setFormulario={setFormulario}
        />
      )}

      {paso === 3 && (
        <h2>Documento</h2>
      )}

      {paso === 4 && (
        <h2>Tipo de Retiro</h2>
      )}

      {paso === 5 && (
        <h2>Autorización</h2>
      )}

      {paso === 6 && (
        <h2>Producto</h2>
      )}

      {paso === 7 && (
        <h2>Confirmación</h2>
      )}

      <button
        onClick={() => {
          if (paso < 7) {
            setPaso(paso + 1);
          }
        }}
      >
        Siguiente
      </button>

    </div>
  );
}



export default NuevoRetiro;