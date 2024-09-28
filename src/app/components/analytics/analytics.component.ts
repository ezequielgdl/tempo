import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
// Services
import { ClientService } from '../../services/client.service';
import { InvoicesService } from '../../services/invoices.service';
// RxJS
import { map, Observable } from 'rxjs';
// Interfaces
import { Client } from '../../interfaces';
import { Invoice } from '../../interfaces';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    @for (iva of iva$ | async; track $index) {
      <p>{{ iva }}</p>
    }
  `,
  styles: ``
})
export class AnalyticsComponent {
  clients$: Observable<Client[]>;
  invoices$: Observable<Invoice[]>;
  iva$: Observable<number[]>;
  
  constructor(private clientService: ClientService, private invoicesService: InvoicesService) {
    this.clients$ = this.clientService.getClients();
    this.invoices$ = this.invoicesService.getInvoices();
    this.iva$ = this.invoices$.pipe(
      map((invoices) => invoices.map((invoice) => invoice.ivaAmount))
    );
  }

  ngOnInit() {

  }

}
