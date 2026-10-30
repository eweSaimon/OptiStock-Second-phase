import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type StatCardVariant = 'neutral' | 'warning' | 'danger';

/**
 * Tarjeta de estadística reutilizable (usada 4 veces en el Dashboard).
 * Toda su configuración llega por input(): no tiene estado propio.
 */
@Component({
  selector: 'app-stat-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="stat-card" [class.stat-card--warning]="variant() === 'warning'" [class.stat-card--danger]="variant() === 'danger'">
      <span class="stat-card__label">{{ label() }}</span>
      <strong class="stat-card__value">{{ value() }}</strong>
    </article>
  `
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<number | string>();
  readonly variant = input<StatCardVariant>('neutral');
}
