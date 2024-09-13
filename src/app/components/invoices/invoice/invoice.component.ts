import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { InvoicesService } from '../../../services/invoices.service';
import { ClientService } from '../../../services/client.service';
import { UserService } from '../../../services/user.service';
import { Invoice, Client, UserInfo } from '../../../interfaces';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
<div class="max-w-4xl mx-auto my-8 bg-white shadow-sm rounded-sm border border-gray-200 p-8">
  <div class="text-center mb-6">
    <h1 class="text-3xl font-bold mb-2">FACTURA</h1>
    <p class="text-lg">Número de factura: {{invoice?.invoiceNumber}}</p>
    <p class="text-sm">Fecha de emisión: {{invoice?.issueDate}}</p>
    @if (invoice?.dueDate) {
    <p class="text-sm">Fecha de devengo: {{invoice?.dueDate}}</p>
    }
  </div>
  
  <div class="flex justify-between mb-8">
    <div class="w-1/2">
      <div class="mb-4">
        <p class="font-bold mb-2">Para</p>
        <p>{{client?.name}}</p>
        @if (client?.CIF) {
        <p>{{client?.CIF}}</p>
        }
        <p>{{client?.address}}</p>
      </div>
    </div>
    
    <div class="w-1/2 text-right">
      <p class="font-bold mb-2">De</p>
      <p>{{user?.name}}</p>
      <p>{{user?.nif}}</p>
      <p>{{user?.address}}</p>
      <p>{{user?.phone}}</p>
      <p>{{user?.website}}</p>
    </div>
  </div>

  <div class="mb-8">
    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2 text-left">Concepto</th>
          <th class="border p-2 text-right">Horas</th>
          <th class="border p-2 text-right">Precio por hora</th>
          <th class="border p-2 text-right">Importe</th>
        </tr>
      </thead>
      <tbody>
        @for (timer of invoice?.timers; track timer.tempId) {
          <tr>
            <td class="border p-2">{{ timer.commentary }}</td>
            <td class="border p-2 text-right">{{ timer.elapsedTime }}</td>
            <td class="border p-2 text-right">{{ timer.pricePerHour | currency:invoice?.currency:'symbol':'' : 'es' }}</td>
            <td class="border p-2 text-right">{{ timer.elapsedTime * timer.pricePerHour | currency:invoice?.currency:'symbol':'': 'es' }}</td>
          </tr>
        }
      </tbody>
    </table>
  </div>

  <div class="flex justify-end">
    <div class="w-1/3">
      <p class="flex justify-between mb-2"><span>Subtotal:</span> <span>{{invoice?.subtotal | currency:invoice?.currency:'symbol':'1.2-2' : 'es' }}</span></p>
      <p class="flex justify-between mb-2"><span>IVA:</span> <span>{{invoice?.iva | currency:invoice?.currency:'symbol':'1.2-2' : 'es' }}</span></p>
      @if (invoice?.irpf! > 0) {
      <p class="flex justify-between mb-2"><span>IRPF:</span> <span>-{{invoice?.irpf | currency:invoice?.currency:'symbol':'1.2-2' : 'es' }}</span></p>
      }
      <p class="flex justify-between font-bold text-lg"><span>Total:</span> <span>{{invoice?.total | currency:invoice?.currency:'symbol':'1.2-2' : 'es' }}</span></p>
    </div>
  </div>
</div>
  `,
  styles: ``
})
export class InvoiceComponent {
  invoice: Invoice | null = null;
  client: Client | null = null;
  user: UserInfo | null = null;

  constructor(private route: ActivatedRoute, private invoicesService: InvoicesService, private clientService: ClientService, private userService: UserService) {
      this.invoicesService.getCurrentInvoice().subscribe(invoice => {
        this.invoice = invoice;
      });
      this.clientService.getClient(this.invoice?.clientId!).subscribe(client => {
        this.client = client;
      });
      this.userService.getUser().subscribe(user => {
        this.user = user;
      });
  }
}
