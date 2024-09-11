import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { InvoicesService } from '../../../services/invoices.service';
import { ClientService } from '../../../services/client.service';
import { Invoice, Client } from '../../../interfaces';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
<div>
  <h1>FACTURA</h1>
  <p>Número de factura: {{invoice?.invoiceNumber}}</p>
  <div>
    <p>Fecha de emisión:</p>
    <p>{{invoice?.issueDate}}</p>
  </div>
  @if (invoice?.dueDate) {
  <div>
    <p>Fecha de devengo:</p>
    <p>{{invoice?.dueDate}}</p>
  </div>
  }
  <div>
    <p><b>Para</b></p>
    <p>{{client?.name}}</p>
    @if (client?.CIF) {
    <p>{{client?.CIF}}</p>
    }
    <p>{{client?.address}}</p>
  </div>
  <div>
    <p><b>De</b></p>
  </div>
<div>
  <table>
    <thead>
      <tr>
        <th>Concepto</th>
        <th>Horas</th>
        <th>Precio por hora</th>
        <th>Importe</th>
      </tr>
    </thead>
    <tbody>
      @for (timer of invoice?.timers; track timer.tempId) {
        <tr>
          <td>{{ timer.commentary }}</td>
          <td>{{ timer.elapsedTime }}</td>
          <td>{{ timer.pricePerHour | currency:invoice?.currency:'symbol':'' : 'es' }}</td>
          <td>{{ timer.elapsedTime * timer.pricePerHour | currency:invoice?.currency:'symbol':'': 'es' }}</td>
        </tr>
      }
    </tbody>
  </table>
  <p>Subtotal: {{invoice?.subtotal | currency:invoice?.currency:'symbol':'1.2-2' : 'es' }}</p>
  <p>IVA: {{invoice?.iva | currency:invoice?.currency:'symbol':'1.2-2' : 'es' }}</p>
  @if (invoice?.irpf! > 0) {
  <p>IRPF: -{{invoice?.irpf | currency:invoice?.currency:'symbol':'1.2-2' : 'es' }}</p>
  }
  <p>Total: {{invoice?.total | currency:invoice?.currency:'symbol':'1.2-2' : 'es' }}</p>
</div>
</div>
  `,
  styles: ``
})
export class InvoiceComponent {
  invoice: Invoice | null = null;
  client: Client | null = null;
  constructor(private route: ActivatedRoute, private invoicesService: InvoicesService, private clientService: ClientService) {
      this.invoicesService.getCurrentInvoice().subscribe(invoice => {
        this.invoice = invoice;
        console.log(this.invoice);
      });
      this.clientService.getClient(this.invoice?.clientId!).subscribe(client => {
        this.client = client;
        console.log(this.client);
      });
  }
}
