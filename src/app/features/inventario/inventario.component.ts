import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductosService } from '../../core/services/productos.service';
import { EstadoPillComponent } from '../../shared/components/estado-pill/estado-pill.component';
import { calcularEstado, formatearMoneda } from '../../shared/utils/inventario.utils';

/**
 * Inventario reutiliza el MISMO ProductosService (providedIn: 'root') que
 * ya cargó Productos: si los datos ya están en memoria, no se vuelve a
 * pedir el JSON. Solo dispara cargar() si llega aquí primero.
 */
@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [EstadoPillComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inventario.component.html'
})
export class InventarioComponent {
  protected readonly productosService = inject(ProductosService);
  protected readonly calcularEstado = calcularEstado;
  protected readonly formatearMoneda = formatearMoneda;

  constructor() {
    if (this.productosService.productos().length === 0) {
      this.productosService.cargar();
    }
  }
}
