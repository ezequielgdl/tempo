import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../app/services/auth-service.service'
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-primary">
      <h1 class="text-4xl md:text-6xl font-bold mb-4 font-pangaia text-off-white">
        Tempo.
      </h1>
      <p class="text-xl md:text-2xl mb-8 text-off-white">Asistente para autónomos.</p>
      @if (!isLoggedIn) {
        <div class="space-x-4">
          <button routerLink="/login" class="button-base button-primary">Login</button>
          <button routerLink="/signup" class="button-base button-secondary">Signup</button>
        </div>
      } 
    </div>
  `,
  styles: ``
})
export class HomeComponent {
  constructor(private authService: AuthService) {}
  isLoggedIn = this.authService.getCurrentUser().pipe(map(user => user !== null));
}
