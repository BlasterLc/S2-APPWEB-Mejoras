import TablaRetiros from "../components/Dashboard/TablaRetiros";
import { useRetiros } from "../context/RetiroContext";
import GraficoEstados from "../components/Dashboard/GraficoEstados";
import GraficoMotivos from "../components/Dashboard/GraficoMotivos";
import GraficoSucursales from "../components/Dashboard/GraficoSucursales";
import GraficoOperadores from "../components/Dashboard/GraficoOperadores";
import GraficoTipoRetiro from "../components/Dashboard/GraficoTipoRetiro";
import GraficoProductos from "../components/Dashboard/GraficoProductos";

function Dashboard() {

  const { retiros, setRetiros } = useRetiros();

  const totalRetiros = retiros.length;

  const aprobados = retiros.filter(
    retiro => retiro.estado === "Aprobado"
  ).length;

  const rechazados = retiros.filter(
    retiro => retiro.estado === "Rechazado"
  ).length;

  const tasaAprobacion =
    totalRetiros > 0
      ? ((aprobados / totalRetiros) * 100).toFixed(1)
      : 0;

  const limpiarHistorial = () => {

    const confirmar = window.confirm(
      "¿Está seguro de eliminar todo el historial de retiros?"
    );

    if (!confirmar) return;

    setRetiros([]);

    localStorage.removeItem("retiros");

    alert("Historial eliminado correctamente");

  };

  return (

    <div className="dashboard">

      <h1>Dashboard de Métricas</h1>

      <button
        className="btn-limpiar"
        onClick={limpiarHistorial}
      >
        🗑 Limpiar Historial
      </button>

      <div className="cards-metricas">

        <div className="card-metrica">
          <h3>Total Retiros</h3>
          <p>{totalRetiros}</p>
        </div>

        <div className="card-metrica">
          <h3>Aprobados</h3>
          <p>{aprobados}</p>
        </div>

        <div className="card-metrica">
          <h3>Rechazados</h3>
          <p>{rechazados}</p>
        </div>

        <div className="card-metrica">
          <h3>Tasa Aprobación</h3>
          <p>{tasaAprobacion}%</p>
        </div>

      </div>

      <div className="graficos-container">

        <GraficoEstados />

        <GraficoMotivos />

        <GraficoSucursales />

        <GraficoOperadores />

        <GraficoTipoRetiro />

        <GraficoProductos />

      </div>

      <TablaRetiros />

    </div>
  );
}

export default Dashboard;