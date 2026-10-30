import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProductosService } from '../../core/services/productos.service';
import { MovimientosService } from '../../core/services/movimientos.service';
import { ProductoListComponent } from './producto-list/producto-list.component';
import { NuevoProducto } from '../../core/models/producto.model';

const CATEGORIAS = ['Cuadernos', 'Escritura', 'Papel', 'Oficina', 'Arte y manualidades'] as const;

/**
 * Contenedor de la sección Productos.
 * Responsabilidades: formulario de registro + validación, y delegar el
 * renderizado de la colección a <app-producto-list>. No manipula el DOM
 * directamente en ningún punto (a diferencia de la Unidad 1): todo pasa
 * por Signals y el motor de cambios de Angular.
 */
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
  protected readonly mensaje = signal<{ texto: string; tipo: 'success' | 'error' } | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    categoria: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(1)]],
    cantidad: [0, [Validators.required, Validators.min(0)]],
    stockMinimo: [0, [Validators.required, Validators.min(0)]]
  });

  constructor() {
    if (this.productosService.productos().length === 0) {
      this.productosService.cargar();
    }
  }

  protected registrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensaje.set({ texto: 'Revisa los campos marcados: todos son obligatorios y los valores deben ser válidos.', tipo: 'error' });
      return;
    }

    const valores = this.form.getRawValue() as NuevoProducto;
    const producto = this.productosService.agregar(valores);

    this.movimientosService.registrar({
      fecha: new Date().toISOString().slice(0, 10),
      producto: producto.nombre,
      tipo: 'Entrada',
      cantidad: producto.cantidad
    });

    this.mensaje.set({ texto: `"${producto.nombre}" se agregó correctamente al inventario.`, tipo: 'success' });
    this.form.reset({ nombre: '', categoria: '', precio: 0, cantidad: 0, stockMinimo: 0 });
  }
}
