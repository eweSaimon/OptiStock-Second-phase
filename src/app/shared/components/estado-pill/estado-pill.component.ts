import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EstadoInventario } from '../../../core/models/producto.model';
import { claseEstado } from '../../utils/inventario.utils';

/**
 * Pill de estado reutilizable. Recibe el estado por input() y calcula
 * su propia clase CSS; así cada tabla (Inventario, Dashboard) no repite
 * la lógica de mapeo estado → color.
 */
@Component({
  selector: 'app-estado-pill',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="pill" [class]="clase()">{{ estado() }}</span>`
})
export class EstadoPillComponent {
  readonly estado = input.required<EstadoInventario>();
  readonly clase = () => claseEstado(this.estado());
}
