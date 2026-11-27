import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Movimiento, NuevoMovimientoRequest } from '../models/movimiento.model';

const API_URL = 'http://localhost:3000/api/movimientos';

@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private readonly http = inject(HttpClient);

  private readonly _movimientos = signal<Movimiento[]>([]);
  private readonly _loading = signal(false);
  private readonly _saving = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly movimientos = this._movimientos.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly saving = this._saving.asReadonly();
  readonly error = this._error.asReadonly();

  cargar(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<Movimiento[]>(API_URL).pipe(
      tap((movimientos) => this._movimientos.set(movimientos)),
      catchError((error: unknown) => {
        this._error.set('No se pudieron cargar los movimientos. Verifica que la API esté activa.');
        console.error('[MovimientosService] Error al cargar movimientos:', error);
        return throwError(() => error);
      })
    ).subscribe({
      next: () => this._loading.set(false),
      error: () => this._loading.set(false)
    });
  }

  registrar(nuevo: NuevoMovimientoRequest): Observable<Movimiento> {
    this._saving.set(true);
    this._error.set(null);

    return this.http.post<Movimiento>(API_URL, nuevo).pipe(
      tap((movimiento) => this._movimientos.update((actuales) => [...actuales, movimiento])),
      catchError((error: unknown) => {
        const mensaje = error && typeof error === 'object' && 'error' in error
          ? (error as { error?: { mensaje?: string } }).error?.mensaje
          : null;
        this._error.set(mensaje || 'No fue posible registrar el movimiento.');
        return throwError(() => error);
      }),
      tap({ finalize: () => this._saving.set(false) })
    );
  }
}
