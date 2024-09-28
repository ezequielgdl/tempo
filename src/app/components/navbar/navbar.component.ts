import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule],
  template: `
    <nav class="flex items-center justify-between bg-off-white px-6 py-4 border-b border-off-white bg-primary-dark">
      <div class="text-2xl font-bold font-pangaia text-off-white cursor-pointer" (click)="navigateToHome()">
        Tempo.
      </div>
      <button (click)="toggleMenu()" class="md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <ul [ngClass]="{'hidden': !isMenuOpen, 'flex': isMenuOpen}" 
      class="flex-col md:flex-row absolute md:relative top-16 left-0 right-0 md:top-auto left-0 right-0 md:left-auto md:right-auto bg-primary-dark text-off-white md:flex items-center space-y-4 md:space-y-0 md:space-x-2 p-4 md:p-0">
        <li><a routerLink="/clients" class="block transition-colors button-base button-primary">Clientes</a></li>
        <li><a routerLink="/timer" class="block transition-colors button-base button-primary">Timer</a></li>
        <li><a routerLink="/invoices" class="block transition-colors button-base button-primary">Facturas</a></li>
        <li><a routerLink="/user" class="block transition-colors hover:text-off-white/80"><mat-icon>person</mat-icon></a></li>
      </ul>
    </nav>
  `,
  styles: ``
})
export class NavbarComponent {
  constructor(private router: Router) {}

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
