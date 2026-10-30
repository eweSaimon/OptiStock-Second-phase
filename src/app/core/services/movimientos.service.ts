import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, throwError } from 'rxjs';
import { Movimiento, NuevoMovimiento } from '../models/movimiento.model';

const ENDPOINT = 'data/movimientos.json';
const LATENCIA_MS = 700;
const PROBABILIDAD_ERROR_SIMULADO = 0.15;

/**
 * Servicio responsable del acceso a los datos de movimientos de inventario.
 * Misma arquitectura que ProductosService: JSON → HttpClient → Signals → UI.
 */
@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private readonly http = inject(HttpClient);

  private readonly _movimientos = signal<Movimiento[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private siguienteId = 1;

  readonly movimientos = this._movimientos.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  cargar(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http
      .get<Movimiento[]>(ENDPOINT)
      .pipe(
        delay(LATENCIA_MS),
        map((movimientos) => this.simularFalloOcasional(movimientos)),
        catchError((error: unknown) => {
          this._error.set('No se pudieron cargar los movimientos. Intenta nuevamente.');
          console.error('[MovimientosService] Error al cargar movimientos:', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (movimientos) => {
          this.siguienteId = movimientos.reduce((max, m) => Math.max(max, m.id), 0) + 1;
          this._movimientos.set(movimientos);
          this._loading.set(false);
        },
        error: () => {
          this._loading.set(false);
        }
      });
  }

  /** Registra un movimiento nuevo (p. ej. la entrada automática al registrar un producto). */
  registrar(nuevo: NuevoMovimiento): void {
    const movimiento: Movimiento = { id: this.siguienteId++, ...nuevo };
    this._movimientos.update((actuales) => [...actuales, movimiento]);
  }

  private simularFalloOcasional<T>(data: T): T {
    if (Math.random() < PROBABILIDAD_ERROR_SIMULADO) {
      throw new Error('Fallo simulado de red (fines académicos de esta entrega)');
    }
    return data;
  }
}
