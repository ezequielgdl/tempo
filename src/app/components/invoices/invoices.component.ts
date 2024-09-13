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
    <h1>Facturas</h1>
    <div class="dropdown">
      <button class="button-base button-primary" (click)="toggleDropdown()">Nueva Factura</button>
      @if (isDropdownOpen) {
      <div class="dropdown-content">
        <select [(ngModel)]="selectedClientId" name="clientSelect">
          <option value="">Seleccionar cliente</option>
          @for (client of clients; track client.id) {
            <option [value]="client.id">{{ client.name }}</option>
          }
        </select>
        <button class="button-base button-primary" routerLink="/invoices/{{ selectedClientId }}/new" [disabled]="!selectedClientId">Crear</button>
      </div>}
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

