import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarNavComponent } from './shared/components/sidebar-nav/sidebar-nav.component';
import { ProductosService } from './core/services/productos.service';
import { estaEnAlerta } from './shared/utils/inventario.utils';

/**
 * Shell de la aplicación: sidebar fija + <router-outlet>.
 * Reemplaza la navegación manual (mostrarSeccion) de la Unidad 1 por
 * Angular Router. El conteo de alertas del sidebar se deriva aquí con
 * un computed signal y se pasa hacia abajo por input().
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarNavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app">
      <app-sidebar-nav [alertCount]="alertCount()" />
      <div class="app__body">
        <router-outlet />
      </div>
    </div>
  `
})
export class AppComponent {
  private readonly productosService = inject(ProductosService);
  protected readonly alertCount = computed(() => this.productosService.productos().filter(estaEnAlerta).length);
}
