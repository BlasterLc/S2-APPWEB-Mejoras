function StepCliente({
  formulario,
  setFormulario,
  avanzarPaso
}) {

  return (
    <>
      <h2>Datos del Cliente</h2>

      <div className="form-group">

        <label>Nombre Completo</label>

        <input
          id="cliente"
          type="text"
          value={formulario.cliente || ""}
          onChange={(e) =>
            setFormulario({
              ...formulario,
              cliente: e.target.value
            })
          }
          onKeyDown={(e) => {

            if (e.key === "Enter") {

              avanzarPaso();

            }

          }}
        />

      </div>
    </>
  );
}

export default StepCliente;