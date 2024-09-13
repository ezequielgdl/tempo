import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Client } from '../../interfaces';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Clientes</h1>

    <button class="button-base button-primary" routerLink="/clients/new">Nuevo Cliente</button>

    @if (clients.length === 0) {
      <p>No clients found.</p>
    } @else {
        <ul class="">
            @for (client of clients; track client) {
              <li class="">
                <span>{{ client.name }}</span>
                <button class="button-base button-primary" [routerLink]="['/clients', client.id, 'edit']">Editar</button>
                <button class="button-base button-secondary" (click)="deleteClient(client.id)">Eliminar</button>
              </li>
            }
        </ul>
    }
  `,
  styles: ``
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
      }
    });
  }

  deleteClient(id: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        this.clientService.deleteClient(id);
        this.clients = this.clients.filter(client => client.id !== id);
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  }
}
