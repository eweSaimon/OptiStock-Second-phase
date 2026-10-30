import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MovimientosService } from '../../core/services/movimientos.service';
import { formatearFecha } from '../../shared/utils/inventario.utils';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movimientos.component.html'
})
export class MovimientosComponent {
  protected readonly movimientosService = inject(MovimientosService);
  protected readonly formatearFecha = formatearFecha;

  /** Más recientes primero, derivado automáticamente del estado del servicio. */
  protected readonly movimientosOrdenados = computed(() =>
    [...this.movimientosService.movimientos()].reverse()
  );

  constructor() {
    if (this.movimientosService.movimientos().length === 0) {
      this.movimientosService.cargar();
    }
  }
}
