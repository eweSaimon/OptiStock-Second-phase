import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, tap, throwError } from 'rxjs';
import { NuevoProducto, Producto } from '../models/producto.model';

/** Ruta del JSON servido como asset estático (carpeta public/). */
const ENDPOINT = 'data/productos.json';

/** Latencia artificial para que loading sea visible en la demo (requisito 5). */
const LATENCIA_MS = 700;

/**
 * Probabilidad de simular un error de red al cargar.
 * Es ÚNICAMENTE para fines didácticos de esta entrega (demostrar el
 * estado "error" con Signals); no representa una falla real del backend,
 * que todavía no existe en esta etapa del proyecto.
 */
const PROBABILIDAD_ERROR_SIMULADO = 0.15;

/**
 * Servicio responsable de TODO el acceso a los datos de productos.
 * Los componentes nunca llaman a HttpClient directamente ni conocen de
 * dónde vienen los datos: solo leen los Signals que expone este servicio.
 *
 * Flujo: JSON (public/data) → HttpClient → Signals → Componentes → UI
 */
@Injectable({ providedIn: 'root' })
export class ProductosService {
  private readonly http = inject(HttpClient);

  // ---- Estado interno (privado y mutable) ----
  private readonly _productos = signal<Producto[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private siguienteId = 1;

  // ---- Estado expuesto (solo lectura hacia afuera del servicio) ----
  readonly productos = this._productos.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  /** Derivados automáticos (computed signals): se recalculan solos cuando cambian los productos. */
  readonly stockTotal = computed(() => this._productos().reduce((total, p) => total + p.cantidad, 0));
  readonly totalProductos = computed(() => this._productos().length);

  /**
   * Carga (o recarga) los productos desde el JSON.
   * Cada llamada crea una suscripción nueva, pero HttpClient completa el
   * observable después de la primera respuesta, así que no hay riesgo de
   * fugas de memoria por suscripciones acumuladas (no se necesita unsubscribe
   * manual aquí). Si este método se reutilizara con un stream continuo,
   * ahí sí habría que cancelar la suscripción anterior, p. ej. con switchMap.
   */
  cargar(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http
      .get<Producto[]>(ENDPOINT)
      .pipe(
        delay(LATENCIA_MS),
        map((productos) => this.simularFalloOcasional(productos)),
        tap((productos) => {
          this.siguienteId = productos.reduce((max, p) => Math.max(max, p.id), 0) + 1;
        }),
        catchError((error: unknown) => {
          this._error.set('No se pudo cargar el inventario. Intenta nuevamente.');
          console.error('[ProductosService] Error al cargar productos:', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (productos) => {
          this._productos.set(productos);
          this._loading.set(false);
        },
        error: () => {
          this._loading.set(false);
        }
      });
  }

  /**
   * Agrega un producto nuevo al estado en memoria (sin persistencia real:
   * no se escribe de vuelta en el JSON, tal como permite el alcance de esta
   * entrega). El id se asigna aquí para que el componente no deba saber
   * cómo se generan los identificadores.
   */
  agregar(nuevo: NuevoProducto): Producto {
    const producto: Producto = { id: this.siguienteId++, ...nuevo };
    this._productos.update((actuales) => [...actuales, producto]);
    return producto;
  }

  private simularFalloOcasional<T>(data: T): T {
    if (Math.random() < PROBABILIDAD_ERROR_SIMULADO) {
      throw new Error('Fallo simulado de red (fines académicos de esta entrega)');
    }
    return data;
  }
}
