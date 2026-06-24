# Backend Django para el flujo de Retiros

## Contexto

El frontend (`S2-APPWEB-Mejoras`, React + Vite) maneja hoy todo el flujo de "Nuevo Retiro" (`src/pages/NuevoRetiro.jsx`) en estado local de React, persistiendo en `localStorage`. El catálogo de productos vive en un array estático (`src/data/inventario.js`). Se necesita un backend Django que reemplace esa persistencia y centralice la lógica de negocio que hoy corre en el cliente.

Este backend se desarrolla en línea con el tutorial de clase "DjangoRestFramework" (`DjangoRestFramework.md`), siguiendo su mismo patrón de proyecto/app/serializers/ModelViewSet/router/Swagger, extendido donde el caso de uso lo requiere.

## Alcance de esta primera versión

- Cubre **solo** el flujo de Retiros y el catálogo de Productos (inventario).
- **Fuera de alcance:** autenticación de operadores (el campo `operador` sigue siendo texto/choices libre, igual que hoy) y migración de la lógica de agregación del dashboard (gráficos/tabla siguen calculándose en el cliente a partir de la lista de retiros).

## Arquitectura

- **Repo separado** del frontend (ej. `taskcampus-backend`), no monorepo. Mantiene independientes los toolchains de Python y Node, y los ciclos de deploy de cada parte.
- **Django + Django REST Framework**, siguiendo el patrón del tutorial: `django-admin startproject <nombre>` + `python manage.py startapp api`, con modelos/serializers/views/urls dentro de la app `api`. El nombre concreto del proyecto se decide al iniciar la implementación.
- **Base de datos: PostgreSQL** (driver `psycopg2-binary`), alineado con lo enseñado en clase — no se usa el SQLite por defecto de Django.
- **CORS:** `django-cors-headers` para permitir que el frontend (Vite, puerto 5173 en dev) llame a la API.
- **Documentación de API:** `drf-spectacular`, expuesta en `/api/docs/` (Swagger UI), `/api/schema/` (esquema OpenAPI) y `/api/redoc/` (Redoc) — igual que en el tutorial.
- **Preferencia de proceso del usuario:** la implementación se hace paso a paso, explicando cada concepto a medida que se introduce (modelos, serializers, viewsets, migraciones, etc.). No se debe generar el backend completo de una sola vez.

## Modelos

### `Producto` (reemplaza `src/data/inventario.js`)

| Campo | Tipo | Notas |
|---|---|---|
| `codigo` | `CharField`, `unique=True` | Ej. `"TV001"` |
| `descripcion` | `CharField` | |
| `estado` | `CharField` (choices) | Default `"Disponible"` |
| `stock` | `PositiveIntegerField` | Default `0` |

### `Retiro` (reemplaza el objeto `formulario` de `NuevoRetiro.jsx` + lo que hoy se guarda en `localStorage`)

| Campo | Tipo | Notas |
|---|---|---|
| `operador` | `CharField` | Texto libre / choices, sin auth (fuera de alcance) |
| `sucursal` | `CharField` (choices) | `Sucursal A`, `Sucursal B`, `Sucursal C` |
| `cliente` | `CharField` | Nombre del cliente, campo embebido (no hay modelo `Cliente` separado) |
| `tipo_documento` | `CharField` (choices) | `rut`, `pasaporte`, `licencia` |
| `numero_documento` | `CharField` | |
| `fecha_vencimiento` | `DateField` | |
| `tipo_retiro` | `CharField` (choices) | `titular`, `tercero` |
| `tercero` | `CharField`, `blank=True` | Solo aplica si `tipo_retiro="tercero"` |
| `autorizacion` | `BooleanField`, default `False` | |
| `numero_autorizacion` | `CharField`, `blank=True` | |
| `observaciones` | `TextField`, `blank=True` | |
| `producto` | `ForeignKey(Producto, on_delete=PROTECT)` | |
| `estado` | `CharField` (choices: `Aprobado`, `Rechazado`) | **Calculado por el servidor**, nunca recibido del cliente |
| `motivo` | `CharField` | **Calculado por el servidor** |
| `fecha` | `DateTimeField(auto_now_add=True)` | |

**Decisión:** los datos de cliente/documento quedan como campos embebidos en `Retiro` (no se modela un `Cliente` separado), porque el formulario actual no necesita reusar/buscar un cliente entre retiros — agregar esa entidad sería complejidad sin beneficio actual.

## Endpoints

Se exponen vía `ModelViewSet` + `DefaultRouter` para ambos modelos, igual que el patrón del tutorial — el CRUD completo queda disponible aunque el frontend hoy solo consuma un subconjunto:

| Endpoint | Verbos | Uso actual del frontend |
|---|---|---|
| `/api/productos/` | `GET` (lista), `POST`, `GET/PUT/PATCH/DELETE {id}/` | `GET` lista — reemplaza el `import inventario` en `StepProducto.jsx` |
| `/api/retiros/` | `GET` (lista), `POST`, `GET/PUT/PATCH/DELETE {id}/` | `GET` lista (dashboard/tabla) y `POST` crear (al confirmar el wizard) |

**Diferencia clave respecto al `ModelViewSet` plano del tutorial:** el `POST /api/retiros/` no se limita a guardar los datos tal cual — el `create()` del serializer se sobreescribe para:
1. Validar que `producto.stock > 0` (si no, `400 Bad Request`).
2. Calcular `estado`/`motivo` server-side, replicando la lógica de `determinarEstado()` actual:
   - `fecha_vencimiento` en el pasado → `estado="Rechazado"`, `motivo="Documento vencido"`.
   - `tipo_retiro="tercero"` y `autorizacion=False` → `estado="Rechazado"`, `motivo="Sin autorización"`.
   - Caso contrario → `estado="Aprobado"`, `motivo="-"`.
3. Si `estado="Aprobado"`, descontar 1 del `stock` del producto, usando una actualización atómica (`F('stock') - 1` dentro de una transacción) para evitar condiciones de carrera entre creaciones simultáneas.

## Manejo de errores

- **Errores estructurales** (campos faltantes/inválidos, `producto` inexistente, `producto.stock <= 0`) → `400 Bad Request`, generados por la validación estándar del serializer más la validación custom del punto anterior.
- **Resultados de negocio** (documento vencido, tercero sin autorización) → **no son errores HTTP**. El request es válido, así que la respuesta es `201 Created` con `estado="Rechazado"` y el `motivo` correspondiente en el cuerpo.
- Listados (`GET`) responden `200 OK` con la lista correspondiente; no hay casos de error particulares ahí más allá de los que maneja DRF por defecto.

## Testing

Se usa `APITestCase` (de DRF) con la base de datos de test que Django crea automáticamente, corrido vía `python manage.py test`.

| Caso | Entrada | Resultado esperado |
|---|---|---|
| Retiro válido, titular, producto con stock | datos completos, `tipo_retiro="titular"` | `201`, `estado="Aprobado"`, stock del producto bajó en 1 |
| Documento vencido | `fecha_vencimiento` en el pasado | `201`, `estado="Rechazado"`, `motivo="Documento vencido"`, stock sin cambios |
| Tercero sin autorización | `tipo_retiro="tercero"`, `autorizacion=false` | `201`, `estado="Rechazado"`, `motivo="Sin autorización"`, stock sin cambios |
| Producto sin stock | `producto` con `stock=0` | `400 Bad Request` |
| Falta un campo obligatorio | sin `cliente`, por ejemplo | `400 Bad Request` |
| Listar productos | — | `200`, lista de productos |
| Listar retiros | — | `200`, lista de retiros creados |
