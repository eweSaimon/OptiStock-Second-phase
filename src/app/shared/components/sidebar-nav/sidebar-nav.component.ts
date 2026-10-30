import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Navegación lateral (se convierte en barra inferior en móvil, vía CSS).
 * Ya no gestiona manualmente qué sección mostrar/ocultar como en la
 * Unidad 1: el propio Angular Router marca la ruta activa mediante
 * routerLinkActive, y el <router-outlet> del shell se encarga del resto.
 *
 * El conteo de alertas llega por input() desde AppComponent: el sidebar
 * no conoce productos ni servicios, solo muestra el número que le pasan.
 */
@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar-nav.component.html',
  styleUrl: './sidebar-nav.component.css'
})
export class SidebarNavComponent {
  readonly alertCount = input<number>(0);
}
