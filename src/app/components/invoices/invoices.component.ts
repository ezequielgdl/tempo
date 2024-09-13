import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Client } from '../../interfaces';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [FormsModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <h1 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-dark-gray">Facturas</h1>
      <div class="relative">
        <button class="button-base button-primary w-full sm:w-auto mb-4" (click)="toggleDropdown()">Nueva Factura</button>
        @if (isDropdownOpen) {
        <div class="absolute z-10 mt-2 w-full sm:w-64 bg-white rounded-md shadow-lg">
          <select [(ngModel)]="selectedClientId" name="clientSelect" class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            <option value="">Seleccionar cliente</option>
            @for (client of clients; track client.id) {
              <option [value]="client.id">{{ client.name }}</option>
            }
          </select>
          <button class="button-base button-primary w-full mt-2" routerLink="/invoices/{{ selectedClientId }}/new" [disabled]="!selectedClientId">Crear</button>
        </div>}
      </div>
    </div>
  `,
  styles: ``
})
export class InvoicesComponent {
  isDropdownOpen = false;
  selectedClientId = '';
  clients: Client[] = [];

  constructor(private clientService: ClientService) {}


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
    });
  }
}

