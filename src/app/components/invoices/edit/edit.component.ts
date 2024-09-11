import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientTimersService } from '../../../services/client-timers.service';
import { Timer } from '../../../interfaces';
import { Client } from '../../../interfaces';
import { ClientService } from '../../../services/client.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-edit-invoice',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Edit Invoice</h2>
    <form [formGroup]="invoiceForm">
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
        <input id="iva" type="number" formControlName="iva">
      </div>
      <div>
        <label for="irpf">IRPF (%):</label>
        <input id="irpf" type="number" formControlName="irpf">
      </div>
      <div>
        <label for="currency">Currency:</label>
        <select id="currency" formControlName="currency">
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
        </select>
      </div>
    </form>

    <h3>Client Timers</h3>
    
    @for (timer of clientTimers; track timer.id) {
      <div class="timer-row">
        <label>
          Proyecto:
          <input type="text" [value]="timer.commentary || ''" placeholder="Observaciones">
        </label>
        <label>
          Horas:
          <input type="text" [value]="formatHours(timer.elapsedTime)">
        </label>
        <label>
          Precio/hora:
          <input type="number" [value]="timer.pricePerHour">
        </label>
        <label>
          IRPF (%):
          <input type="number" [value]="invoiceForm.get('irpf')?.value">
        </label>
        <label>
          IVA (%):
          <input type="number" [value]="invoiceForm.get('iva')?.value">
        </label>
        <label>
          Total: {{ timer.total }}
        </label>
      </div>
    }
    <button (click)="addEmptyTimer()">Add Timer</button>
  `,
  styles: [`
    form div { margin-bottom: 10px; }
    .timer-row { display: flex; gap: 10px; margin-bottom: 5px; }
  `]
})
export class EditInvoiceComponent implements OnInit, OnDestroy {
  invoiceForm: FormGroup;
  clientTimers: Timer[] = [];
  client: Client | null = null;
  private routeSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private clientTimersService: ClientTimersService,
    private clientService: ClientService,
    private route: ActivatedRoute
  ) {
    this.invoiceForm = this.fb.group({
      invoiceNumber: [0, Validators.required],
      issueDate: [this.formatDate(new Date()), Validators.required],
      dueDate: ['', Validators.required],
      client: [this.client?.name || '', Validators.required],
      iva: [21, [Validators.required, Validators.min(0), Validators.max(100)]],
      irpf: [15, [Validators.required, Validators.min(0), Validators.max(100)]],
      currency: ['EUR', Validators.required]
    });
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

  addEmptyTimer() {
    this.clientTimers.push({
      commentary: '',
      elapsedTime: 60,
      pricePerHour: this.client?.pricePerHour || 0,
      invoiceId: this.invoiceForm.get('invoiceNumber')?.value,
      clientId: this.invoiceForm.get('client')?.value,
      formattedTime: '00:00',
      isRunning: false,
      total: 0
    });

  } 

  loadClientTimers() {
    this.clientTimers = this.clientTimersService.getClientTimers();
  }

  formatHours(minutes: number): string {
    return (minutes / 60).toFixed(2).replace('.', ',');
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  calculateTotal(timer: Timer): number {
   const hours = timer.elapsedTime / 60;
    const subtotal = hours * timer.pricePerHour;
    const iva = subtotal * (this.invoiceForm.get('iva')?.value / 100);
    const irpf = subtotal * (this.invoiceForm.get('irpf')?.value / 100);
    return subtotal + iva - irpf;
  }
}
