# OptiStock

Aplicación web para gestionar el inventario de una papelería. Este es el proyecto de Desarrollo Web de Ingeniería Informática, hecho por Simón Marulanda.

En la primera entrega lo hice con HTML, CSS y JavaScript. En esta segunda entrega lo pasé a Angular 18 y la información ahora se carga desde archivos JSON.

## Qué hace

- **Dashboard:** muestra el total de productos, el stock disponible, los productos con stock bajo y los últimos movimientos.
- **Productos:** formulario para registrar un producto nuevo (con validaciones) y lista de los productos registrados. Al hacer clic en una fila se muestra un detalle del producto.
- **Inventario:** tabla con el estado de cada producto: Disponible, Stock bajo o Agotado.
- **Movimientos:** historial de entradas y salidas.
- **Alertas:** productos cuya cantidad es menor o igual al stock mínimo.

## Cómo ejecutarlo

Necesita Node.js 18 o superior.

```bash
npm install
npm start
```

Luego se abre `http://localhost:4200` en el navegador.

Para generar la versión de producción:

```bash
npm run build
```

## Estructura

```
src/app/
  core/
    models/       interfaces Producto y Movimiento
    services/     ProductosService y MovimientosService
  shared/
    components/   tarjeta de estadística, etiqueta de estado y menú lateral
    utils/        funciones para calcular el estado y dar formato
  features/
    dashboard/
    productos/    productos, producto-list y producto-item
    inventario/
    movimientos/
    alertas/
  app.routes.ts
  app.config.ts
  app.component.ts
public/data/
  productos.json
  movimientos.json
```

## Cómo funcionan los datos

Los datos están en `public/data`. Los servicios los piden con `HttpClient` y los guardan en Signals (los datos, si está cargando y si hubo error). Los componentes solo leen esas señales, no saben de dónde vienen los datos.

Cuando se registra un producto se agrega a la lista en memoria y se crea un movimiento de entrada. Como todavía no hay backend, no se guarda en el JSON y al recargar la página se pierde.

## Simulación de carga y error

Para poder mostrar los estados de carga y de error, los servicios esperan 700 ms antes de responder y fallan al azar el 15 % de las veces. Es solo para la demostración. Si sale el mensaje de error, el botón "Reintentar" vuelve a pedir los datos.

## Pendiente

- Backend y base de datos.
- Guardar los cambios de verdad.
- Editar y eliminar productos.
