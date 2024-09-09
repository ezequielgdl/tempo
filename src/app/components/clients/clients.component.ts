import { Component } from '@angular/core';
import { Client } from '../../interfaces';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Clientes</h1>

    <button class="" routerLink="/clients/new">Nuevo Cliente</button>

    @if (clients.length === 0) {
      <p>No clients found.</p>
    } @else {
        <ul class="">
            @for (client of clients; track client) {
              <li class="">
                <span>{{ client.name }}</span>
                <button class="">Editar</button>
              </li>
            }
        </ul>
    }
  `,
  styles: ``
})
export class ClientsComponent {
  clients: Client[] = []
}
