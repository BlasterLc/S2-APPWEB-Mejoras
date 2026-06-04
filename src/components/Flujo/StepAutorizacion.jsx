function StepAutorizacion({
  formulario,
  setFormulario,
  avanzarPaso
}) {

  const esTercero =
    formulario.tipoRetiro === "tercero";

  return (
    <>
      <h2>Autorización de Retiro</h2>

      {!esTercero && (

        <div
          className="estado-documento ok"
          tabIndex="0"
          onKeyDown={(e) => {

            if (e.key === "Enter") {

              avanzarPaso();

            }

          }}
        >
          El titular retirará el pedido.
          No se requiere autorización adicional.
        </div>

      )}

      {esTercero && (
        <>
          <div className="form-group">

            <label>
              ¿Existe autorización del titular?
            </label>

            <select
              id="autorizacion"
              value={
                formulario.autorizacion
                  ? "si"
                  : "no"
              }
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  autorizacion:
                    e.target.value === "si"
                })
              }
              onKeyDown={(e) => {

                if (e.key === "Enter") {

                  document
                    .getElementById(
                      "numeroAutorizacion"
                    )
                    .focus();

                }

              }}
            >
              <option value="no">No</option>
              <option value="si">Sí</option>
            </select>

          </div>

          <div className="form-group">

            <label>
              Número de autorización
            </label>

            <input
              id="numeroAutorizacion"
              type="text"
              value={
                formulario.numeroAutorizacion || ""
              }
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  numeroAutorizacion:
                    e.target.value
                })
              }
              onKeyDown={(e) => {

                if (e.key === "Enter") {

                  document
                    .getElementById(
                      "observaciones"
                    )
                    .focus();

                }

              }}
            />

          </div>

          <div className="form-group">

            <label>Observaciones</label>

            <textarea
              id="observaciones"
              rows="4"
              value={
                formulario.observaciones || ""
              }
              onChange={(e) =>
                setFormulario({
                  ...formulario,
                  observaciones:
                    e.target.value
                })
              }
              onKeyDown={(e) => {

                if (e.key === "Enter") {

                  avanzarPaso();

                }

              }}
            />

          </div>

          {formulario.autorizacion ? (
            <div className="estado-documento ok">
              Autorización válida.
            </div>
          ) : (
            <div className="estado-documento error">
              Se requiere autorización para continuar.
            </div>
          )}

        </>
      )}
    </>
  );
}

export default StepAutorizacion;