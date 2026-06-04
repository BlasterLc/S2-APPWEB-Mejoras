function StepConfirmacion({
  formulario,
  confirmarEntrega
}) {

  return (
    <>
      <h2>Confirmación Final</h2>

      <div className="resumen">

        <h3>Operador</h3>
        <p>{formulario.operador}</p>

        <h3>Sucursal</h3>
        <p>{formulario.sucursal}</p>

        <h3>Cliente</h3>
        <p>{formulario.cliente}</p>

        <h3>Documento</h3>
        <p>
          {formulario.tipoDocumento}
          {" - "}
          {formulario.numeroDocumento}
        </p>

        <h3>Fecha Vencimiento</h3>
        <p>{formulario.fechaVencimiento}</p>

        <h3>Tipo Retiro</h3>
        <p>{formulario.tipoRetiro}</p>

        {formulario.tipoRetiro === "tercero" && (
          <>
            <h3>Tercero</h3>
            <p>{formulario.tercero}</p>

            <h3>Autorización</h3>
            <p>
              {formulario.autorizacion
                ? "Aprobada"
                : "Rechazada"}
            </p>
          </>
        )}

        <h3>Producto</h3>

        <p>
          {formulario.producto?.descripcion}
        </p>

      </div>

      <button
        autoFocus
        className="btn-confirmar"
        onClick={confirmarEntrega}
        onKeyDown={(e) => {

          if (e.key === "Enter") {

            confirmarEntrega();

          }

        }}
      >
        Confirmar Entrega
      </button>

    </>
  );
}

export default StepConfirmacion;