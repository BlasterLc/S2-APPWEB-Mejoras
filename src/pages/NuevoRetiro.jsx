import { useState } from "react";
import Stepper from "../components/Flujo/Stepper";
import StepOperador from "../components/Flujo/StepOperador";
import StepPedido from "../components/Flujo/StepPedido";
import StepDocumento from "../components/Flujo/StepDocumento";
import StepTipoRetiro from "../components/Flujo/StepTipoRetiro";
import StepAutorizacion from "../components/Flujo/StepAutorizacion";
import StepConfirmacion from "../components/Flujo/StepConfirmacion";
import StepFinal from "../components/Flujo/StepFinal";
import { useRetiros } from "../context/RetiroContext";
import { crearRetiro } from "../services/api";

function NuevoRetiro() {

const [paso, setPaso] = useState(1);
const [completado, setCompletado] = useState(false);
const [resultadoFinal, setResultadoFinal] = useState(null);

const { retiros, setRetiros } = useRetiros();

const SUCURSAL = import.meta.env.VITE_SUCURSAL ?? "Sucursal 1";

const [formulario, setFormulario] = useState({

operador: "",
sucursal: SUCURSAL,

pedido: null,

tipoDocumento: "",
numeroDocumento: "",
fechaVencimiento: "",

tipoRetiro: "",

tercero: "",
autorizacion: false,

numeroAutorizacion: "",
observaciones: ""

});

const confirmarEntrega = async () => {

  try {

    const respuesta = await crearRetiro(formulario);

    const nuevoRetiro = {
      ...formulario,
      cliente: formulario.pedido.cliente,
      producto: formulario.pedido.producto,
      id: respuesta.id,
      fecha: respuesta.fecha,
      estado: respuesta.estado,
      motivo: respuesta.motivo
    };

    setRetiros(prev => [
      nuevoRetiro,
      ...prev
    ]);

    setResultadoFinal({
      estado: respuesta.estado,
      motivo: respuesta.motivo
    });

    setCompletado(true);

  } catch (error) {

    console.error(error);
    alert("No se pudo registrar el retiro. Intente nuevamente.");

  }

};

const iniciarNuevoRetiro = () => {

setFormulario({

  operador: "",
  sucursal: SUCURSAL,

  pedido: null,

  tipoDocumento: "",
  numeroDocumento: "",
  fechaVencimiento: "",

  tipoRetiro: "",

  tercero: "",
  autorizacion: false,

  numeroAutorizacion: "",
  observaciones: ""
});

setResultadoFinal(null);
setCompletado(false);
setPaso(1);

};

const avanzarPaso = () => {

  if (
    paso === 1 &&
    (!formulario.operador || !formulario.sucursal)
  ) {
    alert("Complete los datos del operador");
    return;
  }

  if (
    paso === 2 &&
    !formulario.pedido
  ) {
    alert("Busque y seleccione un pedido");
    return;
  }

  if (
    paso === 3 &&
    (
      !formulario.tipoDocumento ||
      !formulario.numeroDocumento ||
      !formulario.fechaVencimiento
    )
  ) {
    alert("Complete los datos del documento");
    return;
  }

  if (paso === 3) {
    const hoy = new Date().toISOString().split("T")[0];
    if (formulario.fechaVencimiento < hoy) {
      alert("No se puede continuar: el documento está vencido");
      return;
    }
  }
  if (
    paso === 4 &&
    !formulario.tipoRetiro
  ) {
    alert("Seleccione quién retira");
    return;
  }

  if (
    paso === 4 &&
    formulario.tipoRetiro === "tercero" &&
    !formulario.tercero
  ) {
    alert("Ingrese el nombre del tercero");
    return;
  }

  if (
    paso === 5 &&
    formulario.tipoRetiro === "tercero" &&
    !formulario.autorizacion
  ) {
    alert("Se requiere autorización para continuar");
    return;
  }

  if (
    paso === 5 &&
    formulario.tipoRetiro === "tercero" &&
    formulario.autorizacion &&
    !formulario.numeroAutorizacion
  ) {
    alert("Ingrese el número de autorización");
    return;
  }

  if (paso < 6) {
    setPaso(paso + 1);
  }
};

return (

<div className="retiro-container">

  {completado && (
    <StepFinal
      resultado={resultadoFinal}
      onNuevoRetiro={iniciarNuevoRetiro}
    />
  )}

  {!completado && (
  <>

  <Stepper paso={paso} />

  {paso === 1 && (

    <StepOperador
      formulario={formulario}
      setFormulario={setFormulario}
      avanzarPaso={avanzarPaso}
    />
  )}

  {paso === 2 && (

    <StepPedido
      formulario={formulario}
      setFormulario={setFormulario}
      avanzarPaso={avanzarPaso}
    />

  )}

  {paso === 3 && (

    <StepDocumento
      formulario={formulario}
      setFormulario={setFormulario}
      avanzarPaso={avanzarPaso}
    />

  )}

  {paso === 4 && (

    <StepTipoRetiro
      formulario={formulario}
      setFormulario={setFormulario}
      avanzarPaso={avanzarPaso}
    />

  )}

  {paso === 5 && (

    <StepAutorizacion
      formulario={formulario}
      setFormulario={setFormulario}
      avanzarPaso={avanzarPaso}
    />

  )}

  {paso === 6 && (

    <StepConfirmacion
      formulario={formulario}
      confirmarEntrega={confirmarEntrega}
    />

  )}

  <div className="acciones">

    <button
      onClick={() => {

        if (paso > 1) {
          setPaso(paso - 1);
        }

      }}
    >
      Anterior
    </button>

    <button onClick={avanzarPaso}>
      Siguiente
    </button>

  </div>

  </>
  )}

</div>

);
}

export default NuevoRetiro;
