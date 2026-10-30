import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Producto } from '../../../core/models/producto.model';
import { EstadoPillComponent } from '../../../shared/components/estado-pill/estado-pill.component';
import { calcularEstado, formatearMoneda } from '../../../shared/utils/inventario.utils';

/**
 * Item individual de la colección de productos. No conoce el array
 * completo: solo recibe "su" producto por input() y, cuando el usuario
 * hace clic, emite un output() con el id para que el contenedor decida
 * qué hacer (en este caso, expandir/contraer el detalle).
 */
@Component({
  selector: 'app-producto-item',
  standalone: true,
  imports: [EstadoPillComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tr class="producto-item" [class.producto-item--seleccionado]="expandido()" (click)="verDetalle.emit(producto().id)">
      <td>{{ producto().nombre }}</td>
      <td>{{ producto().categoria }}</td>
      <td>{{ formatearMoneda(producto().precio) }}</td>
      <td class="cell-numeric">{{ producto().cantidad }}</td>
      <td class="cell-numeric">{{ producto().stockMinimo }}</td>
      <td><app-estado-pill [estado]="calcularEstado(producto())" /></td>
    </tr>
    @if (expandido()) {
      <tr class="producto-item__detalle">
        <td colspan="6">
          Detalle: <strong>{{ producto().nombre }}</strong> pertenece a la categoría
          <strong>{{ producto().categoria }}</strong>. Valor total en stock:
          <strong>{{ formatearMoneda(producto().precio * producto().cantidad) }}</strong>.
        </td>
      </tr>
    }
  `
})
export class ProductoItemComponent {
  readonly producto = input.required<Producto>();
  readonly expandido = input<boolean>(false);

  readonly verDetalle = output<number>();

  protected readonly calcularEstado = calcularEstado;
  protected readonly formatearMoneda = formatearMoneda;
}
