function Stepper({ paso }) {

  const pasos = [
    "Operador",
    "Cliente",
    "Documento",
    "Tipo Retiro",
    "Autorización",
    "Producto",
    "Confirmación"
  ];

  return (
    <div className="stepper">

      {pasos.map((nombre, index) => (

        <div
          key={index}
          className={`step ${paso === index + 1 ? "activo" : ""}`}
        >

          <div className="step-circle">
            {index + 1}
          </div>

          <span>{nombre}</span>

        </div>

      ))}

    </div>
  );
}

export default Stepper;