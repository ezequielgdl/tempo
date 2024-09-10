import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

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
        <li><a routerLink="/invoices">Facturas</a></li>
        <li><button (click)="logout()">Sign Out</button></li>
      </ul>
    </nav>
  `,
  styles: ``
})
export class NavbarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
