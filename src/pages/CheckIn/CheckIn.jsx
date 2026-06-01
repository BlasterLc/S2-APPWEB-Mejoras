const [paso, setPaso] = useState(1);

const [formulario, setFormulario] = useState({
  ejecutivo: "",
  sucursal: "",
  pedido: null,

  compradorNombre: "",
  tipoDocumento: "",
  numeroDocumento: "",

  documentoVigente: false,
  documentoValido: false,

  esTercero: false,

  nombreTercero: "",
  documentoTercero: "",
  poderValido: false
});