import { useState } from "react";
import Stepper from "../components/Flujo/Stepper";

function NuevoRetiro() {

const [paso, setPaso] = useState(1);

  const [formulario, setFormulario] = useState({
    operador: "",
    sucursal: ""
  });
  return (
    <div className="retiro-container">

      <Stepper paso={paso} />

      {paso === 1 && (
        <>
          <h2>Datos del Operador</h2>

          <div className="form-group">
            <label>Nombre del Operador</label>

            <input
              type="text"
              value={formulario.operador}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  operador: e.target.value
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Sucursal</label>

            <input
              type="text"
              value={formulario.sucursal}
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  sucursal: e.target.value
                })
              }
            />
          </div>
        </>
      )}

      {paso === 2 && (
        <h2>Datos del Cliente</h2>
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