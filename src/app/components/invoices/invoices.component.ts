import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../interfaces';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [FormsModule, RouterModule],
  template: `
    <h1>Facturas</h1>
    <div class="dropdown">
      <button (click)="toggleDropdown()">Nueva Factura</button>
      @if (isDropdownOpen) {
      <div class="dropdown-content">
        <select [(ngModel)]="selectedClientId" name="clientSelect">
          <option value="">Seleccionar cliente</option>
          @for (client of clients; track client.id) {
            <option [value]="client.id">{{ client.name }}</option>
          }
        </select>
        <button routerLink="/invoices/{{ selectedClientId }}/new" [disabled]="!selectedClientId">Crear</button>
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

  async ngOnInit() {
    this.clients = await this.clientService.getClients();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  createInvoice() {
    
  }
}

