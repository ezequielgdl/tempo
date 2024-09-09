import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>
      Tempo.
    </h1>
    <p>Asistente para autónomos.</p>
    <button routerLink="/login">Login</button>
    <button routerLink="/signup">Signup</button>
  `,
  styles: ``
})
export class HomeComponent {

}
