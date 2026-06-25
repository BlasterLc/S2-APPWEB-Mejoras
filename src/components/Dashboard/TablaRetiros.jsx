import { useState } from "react";
import { useRetiros } from "../../context/RetiroContext";

function TablaRetiros() {

  const { retiros } = useRetiros();

  const [busqueda, setBusqueda] = useState("");

  const retirosFiltrados = retiros.filter((retiro) => {

    const texto = busqueda.toLowerCase();

    return (
      retiro.cliente?.toLowerCase().includes(texto) ||
      retiro.operador?.toLowerCase().includes(texto) ||
      retiro.producto?.descripcion?.toLowerCase().includes(texto) ||
      retiro.producto?.codigo?.toLowerCase().includes(texto)
    );

  });

  const ultimosRetiros =
    retirosFiltrados.slice(0, 10);

  return (

    <div className="tabla-retiros">

      <h2>Últimos 10 Retiros</h2>

      <input
        type="text"
        placeholder="🔍 Buscar cliente, operador o producto..."
        value={busqueda}
        onChange={(e) =>
          setBusqueda(e.target.value)
        }
        className="input-busqueda"
      />

      <table>

        <thead>

          <tr>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Documento</th>
            <th>Producto</th>
            <th>Estado</th>
          </tr>

        </thead>

        <tbody>

          {ultimosRetiros.length === 0 ? (

            <tr>
              <td colSpan="5">
                No existen coincidencias
              </td>
            </tr>

          ) : (

            ultimosRetiros.map((retiro) => (

              <tr key={retiro.id}>

                <td>{new Date(retiro.fecha).toLocaleString('es-CL')}</td>

                <td>{retiro.cliente}</td>

                <td>{retiro.numeroDocumento}</td>

                <td>
                  {retiro.producto?.descripcion}
                </td>

                <td>

                  <span
                    className={
                      retiro.estado === "Aprobado"
                        ? "estado-ok"
                        : "estado-error"
                    }
                  >
                    {retiro.estado}
                  </span>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );
}

export default TablaRetiros;