/** Movimiento persistido del inventario. */
export interface Movimiento {
  id: number;
  fecha: string;
  producto: string;
  tipo: TipoMovimiento;
  cantidad: number;
}

export type TipoMovimiento = 'Entrada' | 'Salida';

/** Datos enviados por Angular para registrar una entrada o salida. */
export interface NuevoMovimientoRequest {
  productoId: number;
  tipo: TipoMovimiento;
  cantidad: number;
}
