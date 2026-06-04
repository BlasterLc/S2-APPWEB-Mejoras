import { useState } from "react";
import inventario from "../../data/inventario";

function StepProducto({
  formulario,
  setFormulario,
  avanzarPaso
}) {

  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState(null);

  const buscarProducto = () => {

    const encontrado = inventario.find(
      item =>
        item.codigo.toLowerCase() ===
        codigo.toLowerCase()
    );

    setResultado(encontrado || null);
  };

  const seleccionarProducto = () => {

    setFormulario({
      ...formulario,
      producto: resultado
    });

    setTimeout(() => {
      avanzarPaso();
    }, 100);

  };

  return (
    <>
      <h2>Selección de Pedido</h2>

      <div className="form-group">

        <label>Código del Pedido</label>

        <input
          id="codigoPedido"
          type="text"
          value={codigo}
          placeholder="Ej: TV001"
          onChange={(e) =>
            setCodigo(e.target.value)
          }
          onKeyDown={(e) => {

            if (e.key === "Enter") {

              buscarProducto();

            }

          }}
        />

      </div>

      <button onClick={buscarProducto}>
        Buscar Pedido
      </button>

      {resultado && (

        <div
          className="producto-card"
          tabIndex="0"
          onKeyDown={(e) => {

            if (
              e.key === "Enter" &&
              resultado.stock > 0
            ) {

              seleccionarProducto();

            }

          }}
        >

          <h3>
            {resultado.descripcion}
          </h3>

          <p>
            <strong>Código:</strong>{" "}
            {resultado.codigo}
          </p>

          <p>
            <strong>Estado:</strong>{" "}
            {resultado.estado}
          </p>

          <p>
            <strong>Stock:</strong>{" "}
            {resultado.stock}
          </p>

          <div
            className={
              resultado.stock > 0
                ? "estado-documento ok"
                : "estado-documento error"
            }
          >
            {resultado.stock > 0
              ? "Disponible para entrega"
              : "Sin stock"}
          </div>

          <button
            disabled={resultado.stock <= 0}
            onClick={seleccionarProducto}
          >
            Seleccionar Pedido
          </button>

        </div>

      )}

      {!resultado && codigo && (

        <div className="estado-documento error">
          Pedido no encontrado.
        </div>

      )}

      {formulario.producto && (

        <div className="estado-documento ok">

          Producto seleccionado:

          <br />

          <strong>
            {formulario.producto.descripcion}
          </strong>

          <br />

          Código: {formulario.producto.codigo}

        </div>

      )}

    </>
  );
}

export default StepProducto;