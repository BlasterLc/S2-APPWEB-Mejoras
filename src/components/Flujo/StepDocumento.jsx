const MESES = [
  { valor: "01", nombre: "Enero" },
  { valor: "02", nombre: "Febrero" },
  { valor: "03", nombre: "Marzo" },
  { valor: "04", nombre: "Abril" },
  { valor: "05", nombre: "Mayo" },
  { valor: "06", nombre: "Junio" },
  { valor: "07", nombre: "Julio" },
  { valor: "08", nombre: "Agosto" },
  { valor: "09", nombre: "Septiembre" },
  { valor: "10", nombre: "Octubre" },
  { valor: "11", nombre: "Noviembre" },
  { valor: "12", nombre: "Diciembre" }
];

function diasEnMes(anio, mes) {

  if (!anio || !mes) {
    return 31;
  }

  return new Date(Number(anio), Number(mes), 0).getDate();

}

function StepDocumento({
  formulario,
  setFormulario,
  avanzarPaso
}) {

  const hoy = new Date().toISOString().split("T")[0];
  const documentoVencido =
    formulario.fechaVencimiento &&
    formulario.fechaVencimiento < hoy;

  const anioActual = new Date().getFullYear();
  const anioMinimo = anioActual - 20;
  const anioMaximo = anioActual + 20;

  const anios = [];
  for (let a = anioMinimo; a <= anioMaximo; a++) {
    anios.push(a);
  }

  const [anioSel, mesSel, diaSel] = formulario.fechaVencimiento
    ? formulario.fechaVencimiento.split("-")
    : ["", "", ""];

  const dias = [];
  for (let d = 1; d <= diasEnMes(anioSel, mesSel); d++) {
    dias.push(d);
  }

  const actualizarFecha = (anio, mes, dia) => {

    if (!anio || !mes || !dia) {

      setFormulario({
        ...formulario,
        fechaVencimiento: ""
      });

      return;

    }

    const diaFinal = Math.min(Number(dia), diasEnMes(anio, mes));

    setFormulario({
      ...formulario,
      fechaVencimiento:
        `${anio}-${mes}-${String(diaFinal).padStart(2, "0")}`
    });

  };

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
                .getElementById("diaVencimiento")
                .focus();

            }

          }}
        />

      </div>

      <div className="form-group">

        <label>Fecha de Vencimiento</label>

        <div className="fecha-vencimiento-selects">

          <select
            id="diaVencimiento"
            value={diaSel}
            onChange={(e) =>
              actualizarFecha(anioSel, mesSel, e.target.value)
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {

                document
                  .getElementById("mesVencimiento")
                  .focus();

              }

            }}
          >
            <option value="">Día</option>
            {dias.map((d) => (
              <option key={d} value={String(d).padStart(2, "0")}>
                {d}
              </option>
            ))}
          </select>

          <select
            id="mesVencimiento"
            value={mesSel}
            onChange={(e) =>
              actualizarFecha(anioSel, e.target.value, diaSel)
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {

                document
                  .getElementById("anioVencimiento")
                  .focus();

              }

            }}
          >
            <option value="">Mes</option>
            {MESES.map((m) => (
              <option key={m.valor} value={m.valor}>
                {m.nombre}
              </option>
            ))}
          </select>

          <select
            id="anioVencimiento"
            value={anioSel}
            onChange={(e) =>
              actualizarFecha(e.target.value, mesSel, diaSel)
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {

                avanzarPaso();

              }

            }}
          >
            <option value="">Año</option>
            {anios.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

        </div>

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
