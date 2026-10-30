import { EstadoInventario, NivelAlerta, Producto } from '../../core/models/producto.model';

/**
 * Calcula el estado de un producto según su cantidad y su stock mínimo.
 * Misma regla de negocio de la Unidad 1 (primer parcial), ahora como
 * función pura y tipada que cualquier componente puede reutilizar.
 */
export function calcularEstado(producto: Producto): EstadoInventario {
  if (producto.cantidad === 0) {
    return 'Agotado';
  }
  if (producto.cantidad <= producto.stockMinimo) {
    return 'Stock bajo';
  }
  return 'Disponible';
}

/** Un producto entra en alerta cuando su cantidad llegó (o bajó) al mínimo. */
export function estaEnAlerta(producto: Producto): boolean {
  return producto.cantidad <= producto.stockMinimo;
}

/** Nivel de alerta: crítico si está agotado, advertencia si solo está bajo. */
export function calcularNivelAlerta(producto: Producto): NivelAlerta {
  return producto.cantidad === 0 ? 'Crítico' : 'Advertencia';
}

/** Clase CSS asociada a cada estado, para los componentes "pill" compartidos. */
export function claseEstado(estado: EstadoInventario): string {
  switch (estado) {
    case 'Disponible':
      return 'pill--success';
    case 'Stock bajo':
      return 'pill--warning';
    case 'Agotado':
      return 'pill--danger';
  }
}

/** Da formato de pesos colombianos a un número. */
export function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor);
}

/** Convierte "2026-09-18" en "18 sep. 2026". */
export function formatearFecha(fechaIso: string): string {
  const fecha = new Date(fechaIso + 'T00:00:00');
  return fecha.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}
