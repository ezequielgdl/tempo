import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import { InvoicesService } from '../../../services/invoices.service';
import { ClientService } from '../../../services/client.service';
import { UserService } from '../../../services/user.service';
import { Invoice, Client, UserInfo } from '../../../interfaces';
import { signal } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
<button class="button-base button-primary mt-4 mb-4 mx-4" (click)="generatePDF()">Generar PDF</button>
<button class="button-base button-primary mt-4 mb-4 mx-4" (click)="editInvoice()">Editar</button>
<button class="button-base button-primary mt-4 mb-4 mx-4">Guardar</button>
<div #invoiceContent class="max-w-4xl mx-auto my-8 bg-white shadow-sm rounded-sm border border-gray-200 p-8 m-4">
  <div class="text-center mb-6">
    <h1 class="text-3xl font-bold mb-2">FACTURA</h1>
    <p class="text-lg">Número de factura: {{invoiceSignal()?.invoiceNumber}}</p>
    <p class="text-sm">Fecha de emisión: {{invoiceSignal()?.issueDate}}</p>
    @if (invoiceSignal()?.dueDate) {
    <p class="text-sm">Fecha de devengo: {{invoiceSignal()?.dueDate}}</p>
    }
  </div>
  
  <div class="flex justify-between mb-8">
    <div class="w-1/2">
      <div class="mb-4">
        <p class="font-bold mb-2">Para</p>
        <p>{{clientSignal()?.name}}</p>
        @if (clientSignal()?.CIF) {
        <p>{{clientSignal()?.CIF}}</p>
        }
        <p>{{clientSignal()?.address}}</p>
      </div>
    </div>
    
    <div class="w-1/2 text-right">
      <p class="font-bold mb-2">De</p>
      <p>{{userSignal()?.name}}</p>
      <p>{{userSignal()?.nif}}</p>
      <p>{{userSignal()?.address}}</p>
      <p>{{userSignal()?.phone}}</p>
      <p>{{userSignal()?.website}}</p>
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
        @for (timer of invoiceSignal()?.timers; track timer.tempId) {
          <tr>
            <td class="border p-2">{{ timer.commentary }}</td>
            <td class="border p-2 text-right">{{ timer.elapsedTime }}</td>
            <td class="border p-2 text-right">{{ timer.pricePerHour | currency:invoiceSignal()?.currency:'symbol':'' : 'es' }}</td>
            <td class="border p-2 text-right">{{ timer.elapsedTime * timer.pricePerHour | currency:invoiceSignal()?.currency:'symbol':'': 'es' }}</td>
          </tr>
        }
      </tbody>
    </table>
  </div>

  <div class="flex justify-end">
    <div class="w-1/3">
      <p class="flex justify-between mb-2"><span>Subtotal:</span> <span>{{invoiceSignal()?.subtotal | currency:invoiceSignal()?.currency:'symbol':'1.2-2' : 'es' }}</span></p>
      <p class="flex justify-between mb-2"><span>IVA {{invoiceSignal()?.ivaRate}}%:</span> <span>{{invoiceSignal()?.ivaAmount | currency:invoiceSignal()?.currency:'symbol':'1.2-2' : 'es' }}</span></p>
      @if (invoiceSignal()?.irpfAmount! > 0) {
      <p class="flex justify-between mb-2"><span>IRPF {{invoiceSignal()?.irpfRate}}%:</span> <span>-{{invoiceSignal()?.irpfAmount | currency:invoiceSignal()?.currency:'symbol':'1.2-2' : 'es' }}</span></p>
      }
      <p class="flex justify-between font-bold text-lg"><span>Total:</span> <span>{{invoiceSignal()?.total | currency:invoiceSignal()?.currency:'symbol':'1.2-2' : 'es' }}</span></p>
    </div>
  </div>
</div>
  `,
  styles: ``
})
export class InvoiceComponent implements OnInit {

  invoiceSignal = signal<Invoice | null>(null);

  clientSignal = signal<Client | null>(null);

  userSignal = signal<UserInfo | null>(null);

  @ViewChild('invoiceContent') invoiceContent!: ElementRef;

  constructor(private route: ActivatedRoute,
    private invoicesService: InvoicesService,
    private clientService: ClientService,
    private userService: UserService,
    private router: Router) {}

  ngOnInit(): void {
    this.initializeInvoiceData();
    this.initializeUserData();
  }

  private initializeInvoiceData(): void {
    const invoiceId = this.route.snapshot.params['invoiceId'];
    this.invoicesService.getCurrentInvoice().subscribe(invoice => {
      if (invoice) {
        this.invoiceSignal.set(invoice);
        if (invoice.clientId) {
          this.clientService.getClientById(invoice.clientId).subscribe(client => {
            this.clientSignal.set(client);
          });
        }
      } else {
        console.error('Invoice not found');
        // Handle error (e.g., redirect to 404 page)
      }
    });
  }

  editInvoice(): void {
    const invoiceId = this.route.snapshot.params['invoiceId'];
    if (invoiceId) {
      this.router.navigate(['/invoices', invoiceId, 'edit']);
    } else {
      console.error('No invoice ID available');
    }
  }

  private initializeUserData(): void {
    this.userService.getUser().subscribe(user => {
      this.userSignal.set(user);
    });
  }

  generatePDF(): void {
    const element = this.invoiceContent.nativeElement;
    
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Open PDF in a new tab
      window.open(URL.createObjectURL(pdf.output('blob')), '_blank');
    });
  }
}
