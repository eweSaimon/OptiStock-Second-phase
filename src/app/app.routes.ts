import { Routes } from '@angular/router';

/**
 * Rutas reales de la aplicación (requisito 8/Unidad 2: Angular Router).
 * Cada componente se carga de forma diferida (loadComponent) para que
 * el primer bundle no incluya todas las secciones de una vez.
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    title: 'OptiStock · Dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
  },
  {
    path: 'productos',
    title: 'OptiStock · Productos',
    loadComponent: () => import('./features/productos/productos.component').then((m) => m.ProductosComponent)
  },
  {
    path: 'inventario',
    title: 'OptiStock · Inventario',
    loadComponent: () => import('./features/inventario/inventario.component').then((m) => m.InventarioComponent)
  },
  {
    path: 'movimientos',
    title: 'OptiStock · Movimientos',
    loadComponent: () => import('./features/movimientos/movimientos.component').then((m) => m.MovimientosComponent)
  },
  {
    path: 'alertas',
    title: 'OptiStock · Alertas',
    loadComponent: () => import('./features/alertas/alertas.component').then((m) => m.AlertasComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
