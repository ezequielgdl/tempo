import { Component } from '@angular/core';
import { Client } from '../interfaces';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [],
  template: `
    <h1>Cliente</h1>

    <button class="">Nuevo Cliente</button>

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
