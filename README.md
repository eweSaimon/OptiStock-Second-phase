# OptiStock — Segunda entrega (Angular)

Evolución Front-End de OptiStock (plataforma de gestión de inventario de una
papelería) implementada en **Angular 18** (standalone components, Signals,
`@if`/`@for`, Angular Router, `HttpClient`), para la Unidad 2 de Desarrollo Web.

## Requisitos previos

- Node.js 18 o superior (recomendado 20 LTS)
- npm 9+

## Instalación y ejecución

```bash
cd optistock-angular
npm install
npm start
```

Esto levanta el servidor de desarrollo en `http://localhost:4200/`. Angular
redirige automáticamente `/` hacia `/dashboard`.

## Build de producción

```bash
npm run build
```

El resultado queda en `dist/optistock-angular/browser/`.

## Estructura del proyecto

```
src/app/
├── core/
│   ├── models/          Producto, Movimiento (interfaces tipadas)
│   └── services/        ProductosService, MovimientosService (HttpClient + Signals)
├── shared/
│   ├── components/      StatCard, EstadoPill, SidebarNav (reutilizables)
│   └── utils/           inventario.utils.ts (reglas de negocio puras)
├── features/
│   ├── dashboard/
│   ├── productos/       contenedor → producto-list → producto-item
│   ├── inventario/
│   ├── movimientos/
│   └── alertas/
├── app.routes.ts        5 rutas reales, lazy-loaded
└── app.component.ts     shell: sidebar + <router-outlet>

public/data/
├── productos.json
└── movimientos.json
```

## Notas importantes

- **Sin persistencia real:** los datos se cargan desde los JSON en
  `public/data/` vía `HttpClient` y viven en memoria (Signals) mientras la
  pestaña está abierta. Registrar un producto no modifica el archivo JSON.
- **Simulación de carga/error:** cada servicio simula ~700ms de latencia y
  un 15% de probabilidad de error al cargar, únicamente para poder
  demostrar los tres estados (`loading`, `error`, datos) que pide la
  rúbrica. Está documentado como tal en el código (`productos.service.ts`,
  `movimientos.service.ts`). Si un profesor recarga varias veces y le "toca"
  el error simulado, el botón "Reintentar" vuelve a pedir los datos.
- **Sin backend todavía:** conforme al alcance de esta entrega.

## Errores típicos a tener en cuenta

- **Rutas en blanco al recargar con `ng serve`:** no debería ocurrir (el
  dev-server de Angular sí maneja el fallback SPA). Si despliegas el build
  de producción en un hosting estático simple, configura el *rewrite* de
  todas las rutas hacia `index.html` o verás 404 en `/productos`, etc.
- **CORS:** no aplica en esta entrega porque los datos son JSON locales
  servidos por el mismo origen (`public/data/`), no una API externa.
- **`any` implícito:** el proyecto completo está tipado (modelos `Producto`
  y `Movimiento`); evita reintroducir `any` al extender el código.
