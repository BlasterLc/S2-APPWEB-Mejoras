# Sistema de Check-In para Entrega de Productos

Aplicación web desarrollada para gestionar el proceso de retiro de productos, con un flujo de validación paso a paso y un dashboard de métricas en tiempo real.

**Asignatura:** Tecnologías Web  
**Institución:** Universidad San Sebastián  
**Profesor:** René Galarce Godoy

---

## Integrantes

| Nombre | Correo |
|---|---|
| Ignacio Veloso | ivelosob@correo.uss.cl |
| Ignacio Castro | icastror2@correo.uss.cl |
| Jhonatan Godoy | jgodoyr4@correo.uss.cl |
| Matías Rodríguez | mrodriguezg8@correo.uss.cl |
| Matías Pérez | mpereza16@correo.uss.cl |

---

## Tecnologías utilizadas

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- [React Router DOM](https://reactrouter.com/)
- [Recharts](https://recharts.org/)
- [Sass (SCSS)](https://sass-lang.com/)

---

## Funcionalidades

- **Nuevo Retiro:** flujo de 7 pasos con validaciones (operador, cliente, documento, tipo de retiro, autorización, producto y confirmación)
- **Dashboard:** métricas en tiempo real con 6 gráficos y tabla de historial con búsqueda
- **Persistencia:** los retiros se guardan en `localStorage` y se mantienen al recargar

---

## Instalación y uso

### Requisitos previos

Tener [Node.js](https://nodejs.org) instalado.

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Kapriutska21/S2-APPWEB-Desarrollo-FrontEnd.git

# 2. Entrar a la carpeta
cd S2-APPWEB-Desarrollo-FrontEnd

# 3. Instalar dependencias
npm install

# 4. Levantar el servidor de desarrollo
npm run dev
```

Abrir el navegador en `http://localhost:5173`.