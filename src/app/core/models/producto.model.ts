/**
 * Representa un producto del inventario de la papelería.
 * Coincide con la forma de los objetos en public/data/productos.json.
 */
export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  /** Precio unitario en COP */
  precio: number;
  /** Cantidad disponible actualmente */
  cantidad: number;
  /** Umbral a partir del cual el producto se considera en alerta */
  stockMinimo: number;
}

/**
 * Datos del formulario de registro de productos (sin id: lo asigna el servicio).
 */
export type NuevoProducto = Omit<Producto, 'id'>;

/**
 * Estados posibles de un producto según su cantidad frente a su stock mínimo.
 * Se modela como union type (en vez de string suelto) para que el compilador
 * detecte valores inválidos en tiempo de desarrollo.
 */
export type EstadoInventario = 'Disponible' | 'Stock bajo' | 'Agotado';

/** Nivel de alerta mostrado en la sección de Alertas. */
export type NivelAlerta = 'Advertencia' | 'Crítico';
