/**
 * Representa un movimiento de inventario (entrada o salida de un producto).
 * Coincide con la forma de los objetos en public/data/movimientos.json.
 */
export interface Movimiento {
  id: number;
  /** Fecha en formato ISO (yyyy-mm-dd) */
  fecha: string;
  producto: string;
  tipo: TipoMovimiento;
  cantidad: number;
}

export type TipoMovimiento = 'Entrada' | 'Salida';

/** Datos necesarios para registrar un nuevo movimiento (el id lo asigna el servicio). */
export type NuevoMovimiento = Omit<Movimiento, 'id'>;
