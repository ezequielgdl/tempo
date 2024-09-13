import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <nav class="flex items-center justify-between bg-off-white px-6 py-4">
      <div class="text-2xl font-bold font-pangaia">
        Tempo.
      </div>
      <button (click)="toggleMenu()" class="md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <ul [ngClass]="{'hidden': !isMenuOpen, 'flex': isMenuOpen}" class="flex-col md:flex-row absolute md:relative top-16 left-0 right-0 md:top-auto bg-off-white md:flex items-center space-y-4 md:space-y-0 md:space-x-6 p-4 md:p-0">
        <li><a routerLink="/clients" class="block text-dark-gray hover:text-primary transition-colors">Clientes</a></li>
        <li><a routerLink="/timer" class="block text-dark-gray hover:text-primary transition-colors">Timer</a></li>
        <li><a routerLink="/invoices" class="block text-dark-gray hover:text-primary transition-colors">Facturas</a></li>
        <li><a routerLink="/user" class="block text-dark-gray hover:text-primary transition-colors">Usuario</a></li>
        <li><button (click)="logout()" class="button-base button-primary w-full md:w-auto">Sign Out</button></li>
      </ul>
    </nav>
  `,
  styles: ``
})
export class NavbarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
