import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { NuevoProducto, Producto } from '../models/producto.model';

const API_URL = 'http://localhost:3000/api/productos';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private readonly http = inject(HttpClient);

  private readonly _productos = signal<Producto[]>([]);
  private readonly _loading = signal(false);
  private readonly _saving = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly productos = this._productos.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly saving = this._saving.asReadonly();
  readonly error = this._error.asReadonly();

  readonly stockTotal = computed(() => this._productos().reduce((total, producto) => total + producto.cantidad, 0));
  readonly totalProductos = computed(() => this._productos().length);

  cargar(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<Producto[]>(API_URL).pipe(
      tap((productos) => this._productos.set(productos)),
      catchError((error: unknown) => {
        this._error.set('No se pudo cargar el inventario desde el servidor. Verifica que la API esté activa.');
        console.error('[ProductosService] Error al cargar productos:', error);
        return throwError(() => error);
      })
    ).subscribe({
      next: () => this._loading.set(false),
      error: () => this._loading.set(false)
    });
  }

  agregar(nuevo: NuevoProducto): Observable<Producto> {
    this._saving.set(true);
    this._error.set(null);

    return this.http.post<Producto>(API_URL, nuevo).pipe(
      tap((producto) => this._productos.update((actuales) => [...actuales, producto])),
      catchError((error: unknown) => {
        const mensaje = error && typeof error === 'object' && 'error' in error
          ? (error as { error?: { mensaje?: string } }).error?.mensaje
          : null;
        this._error.set(mensaje || 'No fue posible registrar el producto. Intenta nuevamente.');
        return throwError(() => error);
      }),
      tap({ finalize: () => this._saving.set(false) })
    );
  }
}
