function StepTipoRetiro({
  formulario,
  setFormulario,
  avanzarPaso
}) {

  return (
    <>
      <h2>Tipo de Retiro</h2>

      <div className="form-group">

        <label>¿Quién retira el pedido?</label>

        <select
          id="tipoRetiro"
          value={formulario.tipoRetiro}
          onChange={(e) =>
            setFormulario({
              ...formulario,
              tipoRetiro: e.target.value
            })
          }
          onKeyDown={(e) => {

            if (e.key === "Enter") {

              if (formulario.tipoRetiro === "titular") {

                avanzarPaso();

              }

              if (formulario.tipoRetiro === "tercero") {

                document
                  .getElementById("tercero")
                  .focus();

              }

            }

          }}
        >
          <option value="">Seleccione</option>

          <option value="titular">
            Titular de la compra
          </option>

          <option value="tercero">
            Tercero autorizado
          </option>

        </select>

      </div>

      {formulario.tipoRetiro === "tercero" && (

        <div className="form-group">

          <label>Nombre del tercero</label>

          <input
            id="tercero"
            type="text"
            value={formulario.tercero}
            onChange={(e) =>
              setFormulario({
                ...formulario,
                tercero: e.target.value
              })
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {

                avanzarPaso();

              }

            }}
          />

        </div>

      )}

    </>
  );
}

export default StepTipoRetiro;