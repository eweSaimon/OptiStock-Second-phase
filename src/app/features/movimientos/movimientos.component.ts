import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MovimientosService } from '../../core/services/movimientos.service';
import { ProductosService } from '../../core/services/productos.service';
import { formatearFecha } from '../../shared/utils/inventario.utils';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movimientos.component.html'
})
export class MovimientosComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly movimientosService = inject(MovimientosService);
  protected readonly productosService = inject(ProductosService);
  protected readonly formatearFecha = formatearFecha;
  protected readonly mensaje = signal<{ texto: string; tipo: 'success' | 'error' } | null>(null);
  protected readonly guardando = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    productoId: [0, [Validators.required, Validators.min(1)]],
    tipo: ['Entrada' as 'Entrada' | 'Salida', Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1)]]
  });

  protected readonly movimientosOrdenados = computed(() =>
    [...this.movimientosService.movimientos()].reverse()
  );

  constructor() {
    if (this.movimientosService.movimientos().length === 0) this.movimientosService.cargar();
    if (this.productosService.productos().length === 0) this.productosService.cargar();
  }

  protected registrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensaje.set({ texto: 'Selecciona un producto e ingresa una cantidad válida.', tipo: 'error' });
      return;
    }

    const value = this.form.getRawValue();
    this.guardando.set(true);
    this.mensaje.set(null);

    this.movimientosService.registrar({
      productoId: Number(value.productoId),
      tipo: value.tipo,
      cantidad: Number(value.cantidad)
    }).subscribe({
      next: (movimiento) => {
        this.productosService.cargar();
        this.mensaje.set({ texto: movimiento.tipo + ' registrada correctamente para ' + movimiento.producto + '.', tipo: 'success' });
        this.form.reset({ productoId: 0, tipo: 'Entrada', cantidad: 1 });
        this.guardando.set(false);
      },
      error: () => {
        this.mensaje.set({ texto: this.movimientosService.error() || 'No fue posible registrar el movimiento.', tipo: 'error' });
        this.guardando.set(false);
      }
    });
  }
}
