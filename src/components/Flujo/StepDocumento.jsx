function StepDocumento({
  formulario,
  setFormulario,
  avanzarPaso
}) {

  const documentoVencido =
    formulario.fechaVencimiento &&
    new Date(formulario.fechaVencimiento) < new Date();

  return (
    <>
      <h2>Validación de Documento</h2>

      <div className="form-group">

        <label>Tipo de Documento</label>

        <select
          id="tipoDocumento"
          value={formulario.tipoDocumento}
          onChange={(e) =>
            setFormulario({
              ...formulario,
              tipoDocumento: e.target.value
            })
          }
          onKeyDown={(e) => {

            if (e.key === "Enter") {

              document
                .getElementById("numeroDocumento")
                .focus();

            }

          }}
        >
          <option value="">Seleccione</option>
          <option value="rut">RUT</option>
          <option value="pasaporte">Pasaporte</option>
          <option value="licencia">Licencia de Conducir</option>
        </select>

      </div>

      <div className="form-group">

        <label>Número Documento</label>

        <input
          id="numeroDocumento"
          type="text"
          value={formulario.numeroDocumento}
          onChange={(e) =>
            setFormulario({
              ...formulario,
              numeroDocumento: e.target.value
            })
          }
          onKeyDown={(e) => {

            if (e.key === "Enter") {

              document
                .getElementById("fechaVencimiento")
                .focus();

            }

          }}
        />

      </div>

      <div className="form-group">

        <label>Fecha de Vencimiento</label>

        <input
          id="fechaVencimiento"
          type="date"
          value={formulario.fechaVencimiento || ""}
          onChange={(e) =>
            setFormulario({
              ...formulario,
              fechaVencimiento: e.target.value
            })
          }
          onKeyDown={(e) => {

            if (e.key === "Enter") {

              avanzarPaso();

            }

          }}
        />

      </div>

      {formulario.fechaVencimiento && (
        <div
          className={
            documentoVencido
              ? "estado-documento error"
              : "estado-documento ok"
          }
        >
          {documentoVencido
            ? "Documento vencido"
            : "Documento vigente"}
        </div>
      )}
    </>
  );
}

export default StepDocumento;