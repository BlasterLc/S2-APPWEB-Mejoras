# Modelo `Pedido` para ligar Cliente y Producto al Retiro

## Contexto

El backend actual (ver `2026-06-24-django-backend-retiros-design.md`) modela `Retiro` con `cliente` como texto libre y `producto` como FK directa, sin ninguna relación previa entre ambos. El paso "Selección de Pedido" del wizard en realidad buscaba un `Producto` por su código de inventario (SKU) — no existía ningún "pedido" real al que ese código perteneciera, y el operador podía tipear cualquier nombre de cliente y asignarle cualquier producto del catálogo, sin verificar que ese cliente realmente lo hubiera comprado.

Esto se detectó como una inconsistencia conceptual: el nombre del paso ("Pedido") prometía una relación que el modelo de datos no tenía. Esta spec agrega esa relación.

## Alcance

- Se agrega un modelo `Pedido` que liga `cliente` + `producto` bajo un código único, representando una compra ya hecha (fuera de alcance simular esa compra — se crea a mano vía admin de Django).
- `Retiro` pasa a referenciar un `Pedido` (en vez de tener `cliente`/`producto` sueltos), y un mismo `Pedido` solo puede dar lugar a un `Retiro`.
- El wizard del frontend reemplaza los pasos "Cliente" y "Selección de Pedido" (que en realidad buscaba un producto) por un único paso "Buscar Pedido", que autocompleta cliente + producto juntos.
- **Fuera de alcance:** una pantalla para registrar pedidos/ventas dentro de este sistema; eso sigue siendo un proceso externo. Tampoco se agrega `cantidad` ni fecha de compra al `Pedido` — no hay ningún caso de uso actual que los necesite.

## Modelos

### `Pedido` (nuevo)

| Campo | Tipo | Notas |
|---|---|---|
| `codigo` | `CharField`, `unique=True` | Asignado a mano (admin), ej. `"PED-0001"` |
| `cliente` | `CharField(max_length=150)` | Mismo formato que el `Retiro.cliente` actual |
| `producto` | `ForeignKey(Producto, on_delete=PROTECT, related_name="pedidos")` | |

### `Retiro` (modificado)

- Se eliminan los campos `cliente` y `producto`.
- Se agrega: `pedido = models.OneToOneField(Pedido, on_delete=models.PROTECT, related_name="retiro")`.
- `cliente` y `producto` se acceden de ahora en más vía `retiro.pedido.cliente` / `retiro.pedido.producto`.
- El `OneToOneField` agrega una constraint `UNIQUE` a nivel de base de datos sobre `pedido_id` — un segundo `Retiro` para el mismo `Pedido` es rechazado por la base de datos, no solo por una validación de aplicación.

## Endpoints

`Pedido` se expone con el mismo patrón `ModelViewSet` + `DefaultRouter` que `Producto`/`Retiro`, pero con `lookup_field = "codigo"` para poder buscarlo directamente por su código:

```python
class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer
    lookup_field = "codigo"
```

Esto habilita `GET /api/pedidos/{codigo}/` (ej. `/api/pedidos/PED-0001/`), que es lo que usa el nuevo paso del wizard. `PedidoSerializer` es un `ModelSerializer` plano (`fields = "__all__"`).

`Pedido` se registra también en `api/admin.py` (`admin.site.register(Pedido)`) — es el único lugar, dentro del alcance de este proyecto, donde se va a crear un `Pedido`.

## Lógica de negocio (`POST /api/retiros/`)

El payload de creación ahora recibe `pedido` (id) en vez de `cliente`/`producto`. El `RetiroSerializer.create()` sobreescrito:

1. Si el `Pedido` ya tiene un `Retiro` asociado → `400 Bad Request`, `{"pedido": "Este pedido ya fue retirado."}`.
2. `producto = pedido.producto`; si `producto.stock <= 0` → `400 Bad Request` (igual que hoy).
3. Calcular `estado`/`motivo` con las mismas reglas vigentes:
   - `fecha_vencimiento` en el pasado → `Rechazado` / `"Documento vencido"`.
   - `tipo_retiro="tercero"` sin `autorizacion` → `Rechazado` / `"Sin autorización"`.
   - Caso contrario → `Aprobado` / `"-"`.
4. Crear el `Retiro` con `pedido=pedido`; si quedó `Aprobado`, descontar 1 del stock del producto (mismo patrón transaccional con `F('stock') - 1` de hoy).

`estado` y `motivo` siguen siendo `read_only_fields`, calculados siempre server-side.

## Frontend (wizard)

- Se eliminan `StepCliente.jsx` y el `StepProducto.jsx` actual (la búsqueda por código de producto). Se crea `StepPedido.jsx`: un input de "Código de Pedido" que busca vía `GET /api/pedidos/{codigo}/` y muestra el cliente y el producto encontrados (descripción, código, stock). El botón de selección queda deshabilitado si `producto.stock <= 0`. Al confirmar, guarda `formulario.pedido` (objeto completo: `id`, `codigo`, `cliente`, `producto`).
- Nuevo orden del wizard: **Operador → Pedido → Documento → Tipo Retiro → Autorización → Confirmación** (6 pasos, antes 7 — se elimina el paso "Cliente" como paso independiente).
- `StepConfirmacion` y `StepFinal` leen `formulario.pedido.cliente` y `formulario.pedido.producto.descripcion` en vez de `formulario.cliente` / `formulario.producto`.
- `services/api.js`: `crearRetiro` manda `{ ..., pedido: formulario.pedido.id }` en vez de `cliente`/`producto` sueltos.
- Como la respuesta de `Retiro` ya no incluye `cliente`/`producto` directos, `adaptarRetiroDesdeApi` (usado para poblar la Tabla y los Gráficos del Dashboard con los retiros ya existentes) necesita también la lista de `pedidos` además de `productos`, para resolver `retiro.pedido → {cliente, producto}` de la misma forma en que hoy resuelve `producto` a partir de su id.

## Datos existentes y testing

- Los `Retiro` de prueba creados durante el desarrollo del backend (sin `Pedido` asociado) quedan inválidos contra el nuevo esquema; al no tener valor real, se borran antes de aplicar la migración que agrega `Retiro.pedido` como campo requerido.
- `api/tests.py` se reescribe: `setUp` crea un `Pedido` (en vez de pasar `cliente`/`producto` sueltos al armar los datos del POST), y se agrega un caso nuevo: crear un segundo `Retiro` para un `Pedido` ya usado → `400 Bad Request`.

## Manejo de errores (actualizado respecto al spec original)

| Caso | Resultado |
|---|---|
| `pedido` inexistente | `400 Bad Request` (validación estándar de FK) |
| `pedido` ya retirado | `400 Bad Request`, `{"pedido": "Este pedido ya fue retirado."}` |
| `producto.stock <= 0` | `400 Bad Request` (igual que antes) |
| Documento vencido / tercero sin autorización | `201 Created`, `estado="Rechazado"` (no es un error HTTP — igual que antes) |
