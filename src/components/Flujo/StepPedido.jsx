import { useState, useEffect } from "react";
import { buscarPedido, listarProductos } from "../../services/api";

function StepPedido({ formulario, setFormulario }) {

  const [productos, setProductos] = useState([]);
  const [productosListos, setProductosListos] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState(null);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {

    listarProductos()
      .then(setProductos)
      .catch(() => setProductos([]))
      .finally(() => setProductosListos(true));

  }, []);

  const buscar = async () => {

    setBuscando(true);

    try {
      const pedidoEncontrado = await buscarPedido(codigo.trim());

      if (!pedidoEncontrado) {
        setResultado(null);
        return;
      }

      const producto = productos.find((p) => p.id === pedidoEncontrado.producto) || null;

      setResultado({ ...pedidoEncontrado, producto });
    } catch {
      setResultado(null);
    } finally {
      setBuscando(false);
    }
  };

  return (
    <>
      <h2>Buscar Pedido</h2>

      <div className="form-group">

        <label>Código del Pedido</label>

        <input
          type="text"
          value={codigo}
          placeholder="Ej: PED-0001"
          onChange={(e) =>
            setCodigo(e.target.value)
          }
        />

      </div>

      <button className="btn-buscar" onClick={buscar} disabled={!codigo || buscando || !productosListos}>
        Buscar Pedido
      </button>

      {resultado && (

        <div className="producto-card">

          <h3>{resultado.cliente}</h3>

          <p>
            <strong>Producto:</strong>{" "}
            {resultado.producto?.descripcion}
          </p>

          <p>
            <strong>Stock disponible:</strong>{" "}
            {resultado.producto?.stock}
          </p>

          <div
            className={
              resultado.producto?.stock > 0
                ? "estado-documento ok"
                : "estado-documento error"
            }
          >
            {resultado.producto?.stock > 0
              ? "Disponible para entrega"
              : "Sin stock"}
          </div>

          <button
            className="btn-seleccionar"
            disabled={!resultado.producto || resultado.producto.stock <= 0}
            onClick={() =>
              setFormulario({
                ...formulario,
                pedido: resultado
              })
            }
          >
            Seleccionar Pedido
          </button>

        </div>

      )}

      {resultado === null && codigo && !buscando && (

        <div className="estado-documento error">
          Pedido no encontrado.
        </div>

      )}

      {formulario.pedido && (

        <div className="estado-documento ok">

          Pedido seleccionado:

          <br />

          <strong>{formulario.pedido.cliente}</strong>

          <br />

          Código: {formulario.pedido.codigo}

        </div>

      )}

    </>
  );
}

export default StepPedido;
