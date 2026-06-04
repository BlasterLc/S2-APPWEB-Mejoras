import { useState } from "react";
import Stepper from "../components/Flujo/Stepper";
import StepOperador from "../components/Flujo/StepOperador";
import StepCliente from "../components/Flujo/StepCliente";
import StepDocumento from "../components/Flujo/StepDocumento";
import StepTipoRetiro from "../components/Flujo/StepTipoRetiro";
import StepAutorizacion from "../components/Flujo/StepAutorizacion";
import StepProducto from "../components/Flujo/StepProducto";
import StepConfirmacion from "../components/Flujo/StepConfirmacion";
import { useRetiros } from "../context/RetiroContext";

function NuevoRetiro() {

const [paso, setPaso] = useState(1);

const { retiros, setRetiros } = useRetiros();

const [formulario, setFormulario] = useState({

operador: "",
sucursal: "",

cliente: "",

tipoDocumento: "",
numeroDocumento: "",
fechaVencimiento: "",

documentoVigente: false,

tipoRetiro: "",

tercero: "",
autorizacion: false,

numeroAutorizacion: "",
observaciones: "",

producto: null

});

const determinarEstado = () => {

const fechaActual = new Date();

const fechaDocumento =
  new Date(formulario.fechaVencimiento);

if (fechaDocumento < fechaActual) {

  return {
    estado: "Rechazado",
    motivo: "Documento vencido"
  };

}

if (
  formulario.tipoRetiro === "tercero" &&
  !formulario.autorizacion
) {

  return {
    estado: "Rechazado",
    motivo: "Sin autorización"
  };

}

return {
  estado: "Aprobado",
  motivo: "-"
};

};

const confirmarEntrega = () => {

const resultado = determinarEstado();

const nuevoRetiro = {
  id: Date.now(),
  fecha: new Date().toLocaleString(),

  estado: resultado.estado,
  motivo: resultado.motivo,

  ...formulario
};

setRetiros(prev => [
  nuevoRetiro,
  ...prev
]);

if (resultado.estado === "Aprobado") {

  alert("Entrega aprobada");

} else {

  alert("Entrega rechazada: " + resultado.motivo);

}

setFormulario({

  operador: "",
  sucursal: "",

  cliente: "",

  tipoDocumento: "",
  numeroDocumento: "",
  fechaVencimiento: "",

  documentoVigente: false,

  tipoRetiro: "",

  tercero: "",
  autorizacion: false,

  numeroAutorizacion: "",
  observaciones: "",

  producto: null
});

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
    !formulario.cliente
  ) {
    alert("Ingrese el nombre del cliente");
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

  if (
    paso === 4 &&
    !formulario.tipoRetiro
  ) {
    alert("Seleccione quién retira");
    return;
  }

  if (
    paso === 6 &&
    !formulario.producto
  ) {
    alert("Seleccione un producto");
    return;
  }

  if (paso < 7) {
    setPaso(paso + 1);
  }
};

return (

<div className="retiro-container">

  <Stepper paso={paso} />

  {paso === 1 && (

    <StepOperador
      formulario={formulario}
      setFormulario={setFormulario}
      avanzarPaso={avanzarPaso}
    />
  )}

  {paso === 2 && (

    <StepCliente
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

    <StepProducto
      formulario={formulario}
      setFormulario={setFormulario}
      avanzarPaso={avanzarPaso}
    />

  )}

  {paso === 7 && (

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

</div>

);
}

export default NuevoRetiro;