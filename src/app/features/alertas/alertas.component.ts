import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ProductosService } from '../../core/services/productos.service';
import { calcularNivelAlerta, estaEnAlerta } from '../../shared/utils/inventario.utils';

@Component({
  selector: 'app-alertas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alertas.component.html'
})
export class AlertasComponent {
  protected readonly productosService = inject(ProductosService);
  protected readonly calcularNivelAlerta = calcularNivelAlerta;

  /** Computed signal: se recalcula solo cuando cambian los productos. */
  protected readonly productosEnAlerta = computed(() =>
    this.productosService.productos().filter(estaEnAlerta)
  );

  constructor() {
    if (this.productosService.productos().length === 0) {
      this.productosService.cargar();
    }
  }
}
