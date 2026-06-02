function StepCliente({ formulario, setFormulario }) {
  return (
    <>
      <h2>Datos del Cliente</h2>

      <div className="form-group">
        <label>Nombre Completo</label>

        <input
          type="text"
          value={formulario.cliente || ""}
          onChange={(e) =>
            setFormulario({
              ...formulario,
              cliente: e.target.value
            })
          }
        />
      </div>
    </>
  );
}

export default StepCliente;