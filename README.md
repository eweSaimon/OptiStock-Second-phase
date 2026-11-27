# OptiStock

Sistema web para la gestión del inventario de una papelería. Proyecto académico de Desarrollo Web – Ingeniería Informática.

Esta versión consolida el Front-End desarrollado en Angular 18 con una API REST en Node.js + Express y persistencia local en un archivo JSON.

## Funcionalidades

- **Dashboard:** indicadores de productos, unidades disponibles, alertas y movimientos recientes.
- **Productos:** consulta y registro de productos con validación en Angular y en el servidor.
- **Inventario:** consulta del stock, precio y estado de cada producto.
- **Movimientos:** registro de entradas y salidas, con actualización automática de existencias.
- **Alertas:** identificación de productos agotados o con stock igual o inferior al mínimo.

## Arquitectura

```
Usuario
  ↓
Angular 18 + TypeScript
  ↓
Services + HttpClient
  ↓ HTTP / JSON
Node.js + Express (API REST)
  ↓
backend/data/db.json
```

Los componentes Angular consumen los endpoints mediante servicios. Express valida los datos, aplica las reglas de inventario y conserva los cambios en `backend/data/db.json`.

## Requisitos

- Node.js 18 o superior.
- npm.

## Instalación y ejecución

### 1. Instalar dependencias del Front-End

Desde la raíz del repositorio:

```bash
npm install
```

### 2. Instalar dependencias del Back-End

```bash
cd backend
npm install
```

### 3. Iniciar el servidor

Desde la carpeta `backend`:

```bash
npm start
```

La API queda disponible en `http://localhost:3000`.

### 4. Iniciar Angular

En otra terminal, desde la raíz del repositorio:

```bash
npm start
```

La aplicación queda disponible en `http://localhost:4200`.

## API REST

| Método | Endpoint | Propósito |
|---|---|---|
| GET | `/api/health` | Verificar disponibilidad del servidor. |
| GET | `/api/productos` | Consultar productos. |
| POST | `/api/productos` | Registrar un producto y su entrada inicial, si aplica. |
| GET | `/api/movimientos` | Consultar el historial de movimientos. |
| POST | `/api/movimientos` | Registrar una entrada o salida y actualizar existencias. |

### Ejemplo: registrar producto

```http
POST /api/productos
Content-Type: application/json
```

```json
{
  "nombre": "Resaltador amarillo",
  "categoria": "Escritura",
  "precio": 2500,
  "cantidad": 20,
  "stockMinimo": 5
}
```

### Ejemplo: registrar movimiento

```http
POST /api/movimientos
Content-Type: application/json
```

```json
{
  "productoId": 1,
  "tipo": "Salida",
  "cantidad": 2
}
```

El servidor rechaza cantidades inválidas, productos inexistentes y salidas que superen las existencias disponibles. Las respuestas de error incluyen un mensaje y un código HTTP apropiado.

## Persistencia

Los productos y movimientos se conservan en `backend/data/db.json`. Los registros creados mediante POST se escriben en el archivo y se recuperan mediante GET, incluso después de reiniciar el servidor.

Este mecanismo es una persistencia local apropiada para el alcance académico; no pretende reemplazar una base de datos de producción.

## Pruebas manuales

Con el servidor activo, se puede comprobar:

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/productos
curl http://localhost:3000/api/movimientos
```

Para verificar la integración desde el navegador, abre DevTools → Network y registra un producto o movimiento. Deben observarse las solicitudes POST y las respuestas JSON del servidor.

## Estructura principal

```
backend/
  data/db.json
  package.json
  server.js
src/
  app/
    core/
      models/
      services/
    features/
      alertas/
      dashboard/
      inventario/
      movimientos/
      productos/
    shared/
  styles.css
  main.ts
package.json
```

## Alcance y limitaciones

- La persistencia utiliza un archivo JSON local y está pensada para ejecución en un único entorno de demostración.
- No incluye autenticación, sesiones ni despliegue en producción, ya que no son requisitos generales de la entrega.
- No implementa operaciones de edición o eliminación de productos.
