import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

import { Client, Invoice } from '../../interfaces';
import { ClientService } from '../../services/client.service';
import { InvoicesService } from '../../services/invoices.service';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [FormsModule, RouterModule, AsyncPipe, CurrencyPipe, DatePipe],
  template: `
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <h2 class="text-2xl sm:text-3xl mb-4 sm:mb-6 text-off-white">Facturas</h2>
      
      <button class="button-base button-secondary w-full sm:w-auto mb-4 sm:mb-6" (click)="toggleDropdown()">
        Nueva Factura
      </button>
      
      @if (isDropdownOpen) {
        <div class="fixed inset-0 z-50 overflow-auto bg-primary-dark bg-opacity-50 flex items-center justify-center">
          <div class="relative bg-primary-darker w-full max-w-md m-auto flex-col flex rounded-lg shadow-lg border border-off-white">
            <div class="p-5">
              <h3 class="text-lg leading-6 font-medium text-off-white mb-4">Nueva Factura</h3>
              <div class="mb-4">
                <select 
                  [(ngModel)]="selectedClientId" 
                  name="clientSelect" 
                  class="block w-full bg-primary-dark border border-off-white rounded-lg py-2 px-4 text-off-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Seleccionar cliente</option>
                  @for (client of clients$ | async; track client.id) {
                    <option [value]="client.id">{{ client.name }}</option>
                  }
                </select>
              </div>
              <div class="flex flex-col space-y-2">
                <button 
                  class="button-base button-secondary"
                  routerLink="/invoices/new/{{ selectedClientId }}" 
                  [disabled]="!selectedClientId"
                  (click)="toggleDropdown()"
                >
                  Crear
                </button>
                <button 
                  class="button-base button-cancel"
                  (click)="toggleDropdown()"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      }
      
      @if (invoices$ | async; as invoices) {
        @if (invoices.length === 0) {
          <p class="text-lg text-off-white">No hay facturas.</p>
        } @else {
          <div class="overflow-x-auto bg-primary-darker rounded-lg shadow border border-off-white">
            <table class="w-full table-auto">
              <thead class="bg-primary-dark">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-off-white uppercase tracking-wider">Fecha de emisión</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-off-white uppercase tracking-wider">Número de factura</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-off-white uppercase tracking-wider">Total</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-off-white uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody class="bg-primary-darker divide-y divide-off-white">
                @for (invoice of invoices; track invoice.id) {
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-off-white">{{ invoice.issueDate | date:'dd/MM/yyyy' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-off-white">{{ invoice.invoiceNumber }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-off-white">{{ invoice.total | currency:invoice.currency }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <button 
                        class="button-base button-secondary w-full sm:w-auto"
                        (click)="setInvoice(invoice)" 
                        [routerLink]="['/invoices', invoice.id]"
                      >
                        Ver factura
                      </button>
                      <button 
                        class="button-base button-secondary w-full sm:w-auto mt-2 sm:mt-0 sm:ml-2"
                        (click)="confirmRemoveInvoice(invoice)"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      }
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

  confirmRemoveInvoice(invoice: Invoice) {
    const confirmation = confirm('¿Estás seguro de que deseas eliminar esta factura?');
    if (confirmation) {
      this.invoicesService.removeInvoiceById(invoice.id);
    }
  }
}
