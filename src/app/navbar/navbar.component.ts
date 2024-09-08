import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav>
      <div class="logo-space">
        <!-- Space for logo -->
      </div>
      <ul>
        <li><a routerLink="/clients">Clientes</a></li>
        <li><a routerLink="/timer">Timer</a></li>
      </ul>
    </nav>
  `,
  styles: ``
})
export class NavbarComponent {

}
