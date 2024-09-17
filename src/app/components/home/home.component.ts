import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../app/services/auth-service.service'
import { Observable, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-primary">
      <h1 class="text-4xl md:text-6xl font-bold mb-4 font-pangaia text-off-white">
        Tempo.
      </h1>
      <p class="text-xl md:text-2xl mb-8 text-off-white">Asistente para autónomos.</p>
      @if (!(isLoggedIn$ | async)) {
        <div class="space-x-4">
          <button routerLink="/login" class="button-base button-secondary">Login</button>
          <button routerLink="/signup" class="button-base button-secondary">Signup</button>
        </div>
      } 
    </div>
  `,
  styles: ``
})
export class HomeComponent {
  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.getCurrentUser().pipe(map(user => user !== null));
  }
}
