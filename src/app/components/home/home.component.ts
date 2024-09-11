import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../app/services/auth-service.service'
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>
      Tempo.
    </h1>
    <p>Asistente para autónomos.</p>
    @if (!isLoggedIn) {
      <button routerLink="/login">Login</button>
      <button routerLink="/signup">Signup</button>
    } 
  `,
  styles: ``
})
export class HomeComponent {
  constructor(private authService: AuthService) {}
  isLoggedIn = this.authService.getCurrentUser().pipe(map(user => user !== null));
}
