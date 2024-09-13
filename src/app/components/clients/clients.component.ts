import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Client } from '../../interfaces';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <h1 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-dark-gray">Clientes</h1>

      <button class="button-base button-primary w-full sm:w-auto mb-4 sm:mb-6" routerLink="/clients/new">Nuevo Cliente</button>

      @if (clients.length === 0) {
        <p class="text-lg text-dark-gray">No clients found.</p>
      } @else {
          <ul class="space-y-3 sm:space-y-4">
              @for (client of clients; track client) {
                <li class="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-off-white p-3 sm:p-4 rounded-lg shadow">
                  <span class="text-lg text-dark-gray mb-2 sm:mb-0">{{ client.name }}</span>
                  <div class="flex space-x-2 w-full sm:w-auto">
                    <button class="button-base button-primary flex-1 sm:flex-none" [routerLink]="['/clients', client.id, 'edit']">Editar</button>
                    <button class="button-base button-secondary flex-1 sm:flex-none" (click)="deleteClient(client.id)">Eliminar</button>
                  </div>
                </li>
              }
          </ul>
      }
    </div>
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
