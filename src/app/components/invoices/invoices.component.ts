import { Component, Signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';


import { Client, Invoice } from '../../interfaces';
import { ClientService } from '../../services/client.service';
import { InvoicesService } from '../../services/invoices.service';
@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [FormsModule, RouterModule, AsyncPipe, CurrencyPipe, DatePipe],
  template: `
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <h1 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-dark-gray">Facturas</h1>
      <div class="relative">
        <button class="button-base button-primary w-full sm:w-auto mb-4" (click)="toggleDropdown()">Nueva Factura</button>
        @if (isDropdownOpen) {
        <div class="absolute z-10 mt-2 w-full sm:w-64 bg-white rounded-md shadow-lg">
          <select [(ngModel)]="selectedClientId" name="clientSelect" class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            <option value="">Seleccionar cliente</option>
            @for (client of clients$ | async; track client.id) {
              <option [value]="client.id">{{ client.name }}</option>
            }
          </select>
          <button class="button-base button-primary w-full mt-2" routerLink="/invoices/new/{{ selectedClientId }}" [disabled]="!selectedClientId">Crear</button>
        </div>}
      </div>
      <div>
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="border p-2 text-left">Fecha de emisión</th>
              <th class="border p-2 text-left">Número de factura</th>
              <th class="border p-2 text-left">Total</th>
              <th class="border p-2 text-left">Acción</th>
            </tr>
          </thead>
          <tbody>
            @for (invoice of invoices$ | async; track invoice.id) {
              <tr>
                <td class="border p-2">{{ invoice.issueDate | date:'dd/MM/yyyy' }}</td>
                <td class="border p-2">{{ invoice.invoiceNumber }}</td>
                <td class="border p-2">{{ invoice.total | currency:invoice.currency }}</td>
                <td class="border p-2">
                  <button class="button-base button-secondary" (click)="setInvoice(invoice)" [routerLink]="['/invoices', invoice.id]">Ver factura</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
    </div>
  `,
  styles: ``
})
export class InvoicesComponent {
  isDropdownOpen = false;
  selectedClientId = '';
  clients$: Observable<Client[]>;
  invoices$: Observable<Invoice[]>;

  constructor(private clientService: ClientService, private invoicesService: InvoicesService) {
    this.clients$ = this.clientService.getClients();
    this.invoices$ = this.invoicesService.getInvoices();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  setInvoice(invoice: Invoice) {
    this.invoicesService.setCurrentInvoice(invoice);
  }
}


