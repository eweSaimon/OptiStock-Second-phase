import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ProductosService } from '../../core/services/productos.service';
import { MovimientosService } from '../../core/services/movimientos.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { EstadoPillComponent } from '../../shared/components/estado-pill/estado-pill.component';
import { calcularEstado, estaEnAlerta, formatearFecha } from '../../shared/utils/inventario.utils';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatCardComponent, EstadoPillComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  protected readonly productosService = inject(ProductosService);
  protected readonly movimientosService = inject(MovimientosService);

  protected readonly calcularEstado = calcularEstado;
  protected readonly formatearFecha = formatearFecha;

  /** Productos con stock bajo, limitados a 5 para no saturar el dashboard. */
  protected readonly productosStockBajo = computed(() =>
    this.productosService.productos().filter(estaEnAlerta).slice(0, 5)
  );

  protected readonly alertasCount = computed(() => this.productosService.productos().filter(estaEnAlerta).length);

  protected readonly ultimosMovimientos = computed(() =>
    [...this.movimientosService.movimientos()].slice(-5).reverse()
  );

  /** true mientras CUALQUIERA de los dos servicios esté cargando. */
  protected readonly cargando = computed(() => this.productosService.loading() || this.movimientosService.loading());
  protected readonly hayError = computed(() => this.productosService.error() ?? this.movimientosService.error());

  constructor() {
    if (this.productosService.productos().length === 0) {
      this.productosService.cargar();
    }
    if (this.movimientosService.movimientos().length === 0) {
      this.movimientosService.cargar();
    }
  }

  protected reintentar(): void {
    this.productosService.cargar();
    this.movimientosService.cargar();
  }
}
