import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Client, Timer, Invoice } from '../../../interfaces';
import { ClientService } from '../../../services/client.service';
import { ClientTimersService } from '../../../services/client-timers.service';
import { InvoicesService } from '../../../services/invoices.service';

@Component({
  selector: 'app-edit-invoice',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <h2>Factura para {{ client?.name }}</h2>
    <form [formGroup]="invoiceForm" (ngSubmit)="saveInvoice()" id="invoiceForm">
      <div>
        <label for="invoiceNumber">Número de factura:</label>
        <input id="invoiceNumber" type="text" formControlName="invoiceNumber">
      </div>
      <div>
        <label for="issueDate">Fecha de emisión:</label>
        <input id="issueDate" type="date" formControlName="issueDate">
      </div>
      <div>
        <label for="dueDate">Vencimiento:</label>
        <input id="dueDate" type="date" formControlName="dueDate">
      </div>
      <div>
        <label for="client">Cliente:</label>
        <input id="client" type="text" formControlName="client">
      </div>
      <div>
        <label for="iva">IVA (%):</label>
        <input id="iva" type="number" formControlName="iva" (ngModelChange)="updateTotals()">
      </div>
      <div>
        <label for="irpf">IRPF (%):</label>
        <input id="irpf" type="number" formControlName="irpf" (ngModelChange)="updateTotals()">
      </div>
      <div>
        <label for="subject">Sujeto:</label>
        <input id="subject" type="text" formControlName="subject">
      </div>
      <div>
        <label for="notes">Notas:</label>
        <textarea id="notes" formControlName="notes"></textarea>
      </div>
      <div>
        <label for="currency">Moneda:</label>
        <select id="currency" formControlName="currency">
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
        </select>
      </div>
    </form>

    <h3>Client Timers</h3>
    
    @for (timer of clientTimers; track timer.tempId) {
      <div class="timer-row">
        <label>
          Proyecto:
          <input type="text" [(ngModel)]="timer.commentary" placeholder="Observaciones">
        </label>
        <label>
          Horas:
          <input type="text" [(ngModel)]="timer.elapsedTime" (ngModelChange)="updateTotals()">
        </label>
        <label>
          Precio/hora:
          <input type="text" [(ngModel)]="timer.pricePerHour" (ngModelChange)="updateTotals()">
        </label>
        <label>
          {{ timer.elapsedTime * timer.pricePerHour | currency:invoiceForm.get('currency')?.value }}
        </label>
        <button (click)="removeTimer(timer)">X</button>
      </div>
    }
    <button (click)="addEmptyTimer()">Agregar Item</button>
    <div>Subtotal: {{ subtotal | currency:invoiceForm.get('currency')?.value }}</div>
    <div>IVA ({{ invoiceForm.get('iva')?.value }}%): {{ ivaAmount | currency:invoiceForm.get('currency')?.value }}</div>
    <div>IRPF ({{ invoiceForm.get('irpf')?.value }}%): -{{ irpfAmount | currency:invoiceForm.get('currency')?.value }}</div>
    <div>Total Invoice: {{ totalInvoice | currency:invoiceForm.get('currency')?.value }}</div>
    <button type="submit" form="invoiceForm">Guardar</button>
    <button (click)="cancelInvoice()">Cancelar</button>
  `,
  styles: [`
    form div { margin-bottom: 10px; }
    .timer-row { display: flex; gap: 10px; margin-bottom: 5px; }
    .timer-row button { margin-left: 10px; }
  `]
})
export class EditInvoiceComponent implements OnInit, OnDestroy {
  invoiceForm: FormGroup;
  clientTimers: Timer[] = [];
  client: Client | null = null;
  invoice: Invoice | null = null;
  totalInvoice: number = 0;
  subtotal: number = 0;
  ivaAmount: number = 0;
  irpfAmount: number = 0;
  private routeSubscription!: Subscription;
  private timerIdCounter = 0;

  constructor(
    private fb: FormBuilder,
    private clientTimersService: ClientTimersService,
    private clientService: ClientService,
    private invoicesService: InvoicesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.invoiceForm = this.fb.group({
      invoiceNumber: ['', Validators.required],
      issueDate: [this.formatDate(new Date()), Validators.required],
      dueDate: ['', Validators.required],
      client: [this.client?.name || '', Validators.required],
      iva: [21, [Validators.required, Validators.min(0), Validators.max(100)]],
      irpf: [15, [Validators.required, Validators.min(0), Validators.max(100)]],
      currency: ['EUR', Validators.required],
      subject: [''],
      notes: ['']
    });

    this.invoiceForm.get('iva')?.valueChanges.subscribe(() => this.updateTotals());
    this.invoiceForm.get('irpf')?.valueChanges.subscribe(() => this.updateTotals());
  }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => {
      const clientId = params['id'];
      this.clientService.getClient(clientId).subscribe(client => {
        this.client = client;
        this.invoiceForm.get('client')?.setValue(client?.name || '');
        this.loadClientTimers();
      });
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  updateTotals() {
    this.calculateSubtotal();
    this.calculateIvaAndIrpf();
    this.calculateTotalInvoice();
  }

  calculateSubtotal() {
    this.subtotal = this.clientTimers.reduce((acc, timer) => 
      acc + (timer.elapsedTime * timer.pricePerHour), 0);
  }

  calculateIvaAndIrpf() {
    const ivaRate = this.invoiceForm.get('iva')?.value / 100;
    const irpfRate = this.invoiceForm.get('irpf')?.value / 100;
    this.ivaAmount = this.subtotal * ivaRate;
    this.irpfAmount = this.subtotal * irpfRate;
  }

  calculateTotalInvoice() {
    this.totalInvoice = this.subtotal + this.ivaAmount - this.irpfAmount;
  }

  saveInvoice() {
    this.invoice = {
      ...this.invoiceForm.value,
      timers: this.clientTimers,
      clientId: this.client?.id,
      id: crypto.randomUUID(),
      subtotal: this.subtotal,
      iva: this.ivaAmount,
      irpf: this.irpfAmount,
      total: this.totalInvoice
    };
    this.invoicesService.setCurrentInvoice(this.invoice!);
    this.router.navigate(['/invoices', this.invoice?.id]);
  }

  cancelInvoice() {
    this.router.navigate(['/invoices', this.client?.id, '/new']);
  } 

  loadClientTimers() {
    this.clientTimers = this.clientTimersService.getClientTimers().map(timer => ({
      ...timer,
      elapsedTime: this.formatHours(timer.elapsedTime),
      pricePerHour: this.client?.pricePerHour || 0,
      tempId: this.timerIdCounter++
    }));
    this.updateTotals();
  }

  addEmptyTimer() {
    this.clientTimers.push({
      commentary: '',
      elapsedTime: this.formatHours(60),
      pricePerHour: this.client?.pricePerHour || 0,
      invoiceId: this.invoiceForm.get('invoiceNumber')?.value,
      clientId: this.invoiceForm.get('client')?.value,
      formattedTime: '00:00',
      isRunning: false,
      tempId: this.timerIdCounter++
    });
    this.updateTotals();
  }

  removeTimer(timerToRemove: Timer) {
    this.clientTimers = this.clientTimers.filter(timer => timer !== timerToRemove);
    this.updateTotals();
  }

  formatHours(minutes: number): number {
    return Number((minutes / 60).toFixed(2));
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
