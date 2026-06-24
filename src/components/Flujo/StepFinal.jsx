function StepFinal({ resultado, onNuevoRetiro }) {

  const aprobado = resultado?.estado === "Aprobado";

  return (
    <>
      <h2>
        {aprobado ? "Retiro Registrado" : "Retiro Rechazado"}
      </h2>

      <div
        className={
          aprobado
            ? "estado-documento ok"
            : "estado-documento error"
        }
      >
        {aprobado
          ? "La entrega fue aprobada y registrada con éxito."
          : `La entrega fue rechazada: ${resultado?.motivo}`}
      </div>

      <button
        autoFocus
        className="btn-confirmar"
        onClick={onNuevoRetiro}
      >
        Registrar nuevo retiro
      </button>
    </>
  );
}

export default StepFinal;
