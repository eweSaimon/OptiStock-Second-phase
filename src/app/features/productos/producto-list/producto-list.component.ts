import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { Producto } from '../../../core/models/producto.model';
import { ProductoItemComponent } from '../producto-item/producto-item.component';

/**
 * Colección de productos: recibe el arreglo completo por input() y lo
 * recorre con @for (nada de HTML escrito a mano por producto). Escucha
 * el output() de cada item para saber cuál está expandido.
 */
@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [ProductoItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table class="data-table">
      <thead>
        <tr>
          <th scope="col">Producto</th>
          <th scope="col">Categoría</th>
          <th scope="col">Precio</th>
          <th scope="col">Cantidad</th>
          <th scope="col">Stock mínimo</th>
          <th scope="col">Estado</th>
        </tr>
      </thead>
      <tbody>
        @for (producto of productos(); track producto.id) {
          <app-producto-item
            [producto]="producto"
            [expandido]="producto.id === expandidoId()"
            (verDetalle)="alternarExpandido($event)"
          />
        } @empty {
          <tr class="empty-row"><td colspan="6">Todavía no hay productos registrados.</td></tr>
        }
      </tbody>
    </table>
  `
})
export class ProductoListComponent {
  readonly productos = input.required<Producto[]>();

  /** Estado propio de la colección: qué fila está expandida (solo una a la vez). */
  protected readonly expandidoId = signal<number | null>(null);

  protected alternarExpandido(id: number): void {
    this.expandidoId.update((actual) => (actual === id ? null : id));
  }
}
