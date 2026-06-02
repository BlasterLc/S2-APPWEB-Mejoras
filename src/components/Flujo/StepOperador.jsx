function StepOperador({ formulario, setFormulario }) {
  return (
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
  );
}

export default StepOperador;