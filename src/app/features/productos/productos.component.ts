import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductosService } from '../../core/services/productos.service';
import { MovimientosService } from '../../core/services/movimientos.service';
import { ProductoListComponent } from './producto-list/producto-list.component';
import { NuevoProducto } from '../../core/models/producto.model';

const CATEGORIAS = ['Cuadernos', 'Escritura', 'Papel', 'Oficina', 'Arte y manualidades'] as const;

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [ReactiveFormsModule, ProductoListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './productos.component.html'
})
export class ProductosComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly productosService = inject(ProductosService);
  private readonly movimientosService = inject(MovimientosService);

  protected readonly categorias = CATEGORIAS;
  protected readonly guardando = signal(false);
  protected readonly mensaje = signal<{ texto: string; tipo: 'success' | 'error' } | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    categoria: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(1)]],
    cantidad: [0, [Validators.required, Validators.min(0)]],
    stockMinimo: [0, [Validators.required, Validators.min(0)]]
  });

  constructor() {
    if (this.productosService.productos().length === 0) this.productosService.cargar();
  }

  protected registrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensaje.set({ texto: 'Revisa los campos marcados: todos son obligatorios y los valores deben ser válidos.', tipo: 'error' });
      return;
    }

    const valores = this.form.getRawValue() as NuevoProducto;
    this.guardando.set(true);
    this.mensaje.set(null);

    this.productosService.agregar(valores).subscribe({
      next: (producto) => {
        this.movimientosService.cargar();
        this.mensaje.set({ texto: '"' + producto.nombre + '" se registró y quedó guardado correctamente.', tipo: 'success' });
        this.form.reset({ nombre: '', categoria: '', precio: 0, cantidad: 0, stockMinimo: 0 });
        this.guardando.set(false);
      },
      error: () => {
        this.mensaje.set({ texto: this.productosService.error() || 'No fue posible registrar el producto.', tipo: 'error' });
        this.guardando.set(false);
      }
    });
  }
}
