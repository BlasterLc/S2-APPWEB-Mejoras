const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

export async function listarProductos() {
  const respuesta = await fetch(`${API_URL}/productos/`);

  if (!respuesta.ok) {
    throw new Error("No se pudo cargar el inventario");
  }

  return respuesta.json();
}

export async function listarRetiros() {
  const respuesta = await fetch(`${API_URL}/retiros/`);

  if (!respuesta.ok) {
    throw new Error("No se pudo cargar el historial de retiros");
  }

  return respuesta.json();
}

export async function listarPedidos() {
  const respuesta = await fetch(`${API_URL}/pedidos/`);

  if (!respuesta.ok) {
    throw new Error("No se pudo cargar los pedidos");
  }

  return respuesta.json();
}

export async function buscarPedido(codigo) {
  const respuesta = await fetch(`${API_URL}/pedidos/${codigo}/`);

  if (!respuesta.ok) {
    return null;
  }

  return respuesta.json();
}

export async function crearRetiro(formulario) {
  const payload = {
    operador: formulario.operador,
    sucursal: formulario.sucursal,
    tipo_documento: formulario.tipoDocumento,
    numero_documento: formulario.numeroDocumento,
    fecha_vencimiento: formulario.fechaVencimiento,
    tipo_retiro: formulario.tipoRetiro,
    tercero: formulario.tercero,
    autorizacion: formulario.autorizacion,
    numero_autorizacion: formulario.numeroAutorizacion,
    observaciones: formulario.observaciones,
    pedido: formulario.pedido.id,
  };

  const respuesta = await fetch(`${API_URL}/retiros/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(JSON.stringify(datos));
  }

  return datos;
}

// Convierte un retiro tal como lo devuelve la API (snake_case, pedido como id)
// a la forma que ya usan los componentes del Dashboard (camelCase, cliente y
// producto resueltos a partir del pedido).
export function adaptarRetiroDesdeApi(retiro, pedidos, productos) {
  const pedido = pedidos.find((p) => p.id === retiro.pedido) || null;

  const producto = pedido
    ? productos.find((p) => p.id === pedido.producto) || null
    : null;

  return {
    id: retiro.id,
    operador: retiro.operador,
    sucursal: retiro.sucursal,
    cliente: pedido?.cliente || null,
    tipoDocumento: retiro.tipo_documento,
    numeroDocumento: retiro.numero_documento,
    fechaVencimiento: retiro.fecha_vencimiento,
    tipoRetiro: retiro.tipo_retiro,
    tercero: retiro.tercero,
    autorizacion: retiro.autorizacion,
    numeroAutorizacion: retiro.numero_autorizacion,
    observaciones: retiro.observaciones,
    producto,
    estado: retiro.estado,
    motivo: retiro.motivo,
    fecha: retiro.fecha,
  };
}
