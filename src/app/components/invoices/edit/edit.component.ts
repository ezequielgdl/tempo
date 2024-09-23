import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Client, Timer, Invoice } from '../../../interfaces';
import { ClientService } from '../../../services/client.service';
import { ClientTimersService } from '../../../services/client-timers.service';
import { TimerService } from '../../../services/timer.service';
import { InvoicesService } from '../../../services/invoices.service';
import { InvoiceHelperService } from '../../../services/invoice-helper.service';

@Component({
  selector: 'app-edit-invoice',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <h2 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-dark-gray">Factura</h2>
      <form [formGroup]="invoiceForm" (ngSubmit)="saveInvoice()" id="invoiceForm" class="space-y-4 sm:space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="invoiceNumber" class="block text-dark-gray font-bold mb-2">Número de factura:</label>
            <input id="invoiceNumber" type="text" formControlName="invoiceNumber" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          <div>
            <label for="issueDate" class="block text-dark-gray font-bold mb-2">Fecha de emisión:</label>
            <input id="issueDate" type="date" formControlName="issueDate" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          <div>
            <label for="dueDate" class="block text-dark-gray font-bold mb-2">Vencimiento:</label>
            <input id="dueDate" type="date" formControlName="dueDate" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          <div>
            <label for="client" class="block text-dark-gray font-bold mb-2">Cliente:</label>
            <input id="client" type="text" formControlName="client" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          <div>
            <label for="ivaRate" class="block text-dark-gray font-bold mb-2">IVA (%):</label>
            <input id="ivaRate" type="number" formControlName="ivaRate" (ngModelChange)="updateTotals()" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          <div>
            <label for="irpfRate" class="block text-dark-gray font-bold mb-2">IRPF (%):</label>
            <input id="irpfRate" type="number" formControlName="irpfRate" (ngModelChange)="updateTotals()" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
        </div>
        <div>
          <label for="subject" class="block text-dark-gray font-bold mb-2">Sujeto:</label>
          <input id="subject" type="text" formControlName="subject" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        </div>
        <div>
          <label for="notes" class="block text-dark-gray font-bold mb-2">Notas:</label>
          <textarea id="notes" formControlName="notes" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
        </div>
        <div>
          <label for="currency" class="block text-dark-gray font-bold mb-2">Moneda:</label>
          <select id="currency" formControlName="currency" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </form>

      <h3 class="text-xl font-bold mt-8 mb-4 text-dark-gray">Client Timers</h3>
      
      @for (timer of clientTimers(); track $index) {
        <div class="flex flex-wrap items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4 bg-off-white p-4 rounded-lg">
          <label class="w-full sm:w-auto">
            <input type="text" [(ngModel)]="timer.commentary" placeholder="Observaciones" class="w-full sm:w-auto px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          </label>
          <label class="w-full sm:w-auto">
            Horas/Unidad:
            <input type="text" [(ngModel)]="timer.elapsedTime" (ngModelChange)="updateTotals()" class="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          </label>
          <label class="w-full sm:w-auto">
            Precio x hora/unidad:
            <input type="text" [(ngModel)]="timer.pricePerHour" (ngModelChange)="updateTotals()" class="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          </label>
          <span class="w-full sm:w-auto">
            {{ timer.elapsedTime * timer.pricePerHour | currency:invoiceForm.get('currency')?.value }}
          </span>
          <button class="button-base button-secondary" (click)="removeTimer(timer)">X</button>
        </div>
      }
      <button class="button-base button-primary mb-6" (click)="addEmptyTimer()">Agregar Item</button>

      <form [formGroup]="invoiceTimersForm" (ngSubmit)="onSubmit()" class="max-w-md mx-auto p-4 bg-off-white rounded-lg shadow-md my-10">
      <div class="mb-6">
        <div class="mb-2">
          <label class="flex items-center text-dark-gray">
            <input type="radio" formControlName="invoiceType" value="all" class="mr-2">
            Todas las horas sin facturar
          </label>
        </div>
        <div>
          <label class="flex items-center text-dark-gray">
            <input type="radio" formControlName="invoiceType" value="specific" class="mr-2">
            Horas sin facturar de
          </label>
        </div>
      </div>
      <div class="mb-6">
        <select formControlName="timePeriod" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="thisMonth">Este mes</option>
          <option value="lastMonth">El mes pasado</option>
          <option value="thisQuarter">Este cuatrimestre</option>
          <option value="lastQuarter">El cuatrimestre pasado</option>
          <option value="thisYear">Este año</option>
          <option value="lastYear">El año pasado</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      @if (invoiceTimersForm.get('timePeriod')?.value === 'custom') {
        <div class="mb-4">
          <label for="startDate" class="block text-dark-gray font-bold mb-2">Desde:</label>
          <input type="date" id="startDate" formControlName="startDate" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        </div>
        <div class="mb-6">
          <label for="endDate" class="block text-dark-gray font-bold mb-2">Hasta:</label>
          <input type="date" id="endDate" formControlName="endDate" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        </div>
      }
      <button class="button-base button-primary w-full sm:w-auto" type="submit">Agregar Timers</button>
    </form>

      <div class="space-y-2 text-lg">
        <div>Subtotal: {{ subtotal() | currency:invoiceForm.get('currency')?.value }}</div>
        <div>IVA ({{ invoiceForm.get('ivaRate')?.value }}%): {{ ivaAmount() | currency:invoiceForm.get('currency')?.value }}</div>
        <div>IRPF ({{ invoiceForm.get('irpfRate')?.value }}%): -{{ irpfAmount() | currency:invoiceForm.get('currency')?.value }}</div>
        <div class="font-bold">Total Invoice: {{ totalInvoice() | currency:invoiceForm.get('currency')?.value }}</div>
      </div>
      <div class="mt-6 space-x-4">
        <button class="button-base button-primary" type="submit" form="invoiceForm">Ver Factura</button>
        <button class="button-base button-secondary" (click)="cancelInvoice()">Cancelar</button>
      </div>
    </div>
  `,
  styles: [`
  `]
})
export class EditInvoiceComponent implements OnInit, OnDestroy {
  invoiceForm: FormGroup;
  invoiceTimersForm: FormGroup;
  clientTimers = signal<Timer[]>([]);
  client = signal<Client | null>(null);
  invoice: Invoice | null = null;
  totalInvoice = signal<number>(0); 
  subtotal = signal<number>(0);
  ivaAmount = signal<number>(0);
  irpfAmount = signal<number>(0);
  private routeSubscription!: Subscription;
  private timerIdCounter = 0;
  private clientTimersSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private clientTimersService: ClientTimersService,
    private timerService: TimerService,
    private clientService: ClientService,
    private invoicesService: InvoicesService,
    private route: ActivatedRoute,
    private router: Router,
    private invoiceHelperService: InvoiceHelperService
  ) {
    this.invoiceForm = this.fb.group({
      invoiceNumber: ['', Validators.required],
      issueDate: [this.invoiceHelperService.formatDate(new Date()), Validators.required],
      dueDate: ['', Validators.required],
      client: [this.client()?.name || '', Validators.required],
      ivaRate: [21, [Validators.required, Validators.min(0), Validators.max(100)]],
      irpfRate: [15, [Validators.required, Validators.min(0), Validators.max(100)]],
      currency: ['EUR', Validators.required],
      subject: [''],
      notes: ['']
    });

    this.invoiceTimersForm = this.fb.group({
      invoiceType: ['all'],
      timePeriod: ['thisMonth'],
      startDate: [''],
      endDate: ['']
    });

    this.invoiceForm.get('ivaRate')?.valueChanges.subscribe(() => this.updateTotals());
    this.invoiceForm.get('irpfRate')?.valueChanges.subscribe(() => this.updateTotals());
  }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => {
      const clientId = params['clientId'];
      const invoiceId = params['invoiceId'];

      this.clientService.getClientById(clientId).subscribe(client => {
        this.client.set(client);
        this.invoiceForm.get('client')?.setValue(client?.name || '');
        
        if (invoiceId) {
          this.invoicesService.getCurrentInvoice().subscribe(existingInvoice => {
            if (existingInvoice) {
              this.invoice = existingInvoice;
              this.clientService.getClientById(existingInvoice.clientId).subscribe(client => {
                this.client.set(client);
              });
              this.invoiceHelperService.populateFormWithInvoice(this.invoiceForm, existingInvoice);
              this.clientTimers.set(existingInvoice.timers);
            } else {
              console.error('Invoice not found');
            }
          });
        } else {
          this.loadClientTimers();
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadClientTimers() {
    this.clientTimersSubscription = this.clientTimersService.clientTimers$.subscribe(timers => {
      this.clientTimers.set(timers.map(timer => ({
        ...timer,
        elapsedTime: this.invoiceHelperService.formatHours(timer.elapsedTime),
        pricePerHour: this.client()?.pricePerHour || 0,
      })));
    });
    this.updateTotals();
  }

  onSubmit() {
    const invoiceType = this.invoiceTimersForm.get('invoiceType')?.value;
    const timePeriod = this.invoiceTimersForm.get('timePeriod')?.value;

    if (invoiceType === 'all') {
      this.getAllUninvoicedTimers();
    } else if (invoiceType === 'specific') {
      const { startDate, endDate } = this.invoiceHelperService.getDateRange(timePeriod, new Date());
      this.getAllUninvoicedTimersByDate(startDate, endDate);
    }
  }

  async getAllUninvoicedTimersByDate(firstDay: Date, lastDay: Date) {
    try {
      const timers = await this.timerService.getClientUninvoicedTimersByDate(this.client()!.id, firstDay, lastDay);
      const formattedTimers = timers.map(timer => ({
        ...timer,
        elapsedTime: this.invoiceHelperService.formatHours(timer.elapsedTime),
        pricePerHour: this.client()?.pricePerHour || 0,
      }));
      this.clientTimers.set([...this.clientTimers(), ...formattedTimers]);
    } catch (error) {
      console.error('Error fetching timers by date:', error);
    }
  }

  async getAllUninvoicedTimers() {
    try {
      const timers = await this.timerService.getAllUninvoicedTimers();
      const formattedTimers = timers.map(timer => ({
        ...timer,
        elapsedTime: this.invoiceHelperService.formatHours(timer.elapsedTime),
        pricePerHour: this.client()?.pricePerHour || 0,
      }));
      this.clientTimers.set([...this.clientTimers(), ...formattedTimers]);
    } catch (error) {
      console.error('Error fetching all uninvoiced timers:', error);
    }
  }

  updateTotals() {
    this.subtotal.set(this.invoiceHelperService.calculateSubtotal(this.clientTimers()));
    const { ivaAmount, irpfAmount } = this.invoiceHelperService.calculateIvaAndIrpf(
      this.subtotal(),
      this.invoiceForm.get('ivaRate')?.value,
      this.invoiceForm.get('irpfRate')?.value
    );
    this.ivaAmount.set(ivaAmount);
    this.irpfAmount.set(irpfAmount);
    this.totalInvoice.set(this.invoiceHelperService.calculateTotalInvoice(this.subtotal(), this.ivaAmount(), this.irpfAmount()));
  }

  saveInvoice() {
    const invoiceData = {
      ...this.invoiceForm.value,
      timers: this.clientTimers(),
      clientId: this.client()?.id,
      clientName: this.client()?.name,
      subtotal: this.subtotal(),
      ivaRate: this.invoiceForm.get('ivaRate')?.value,
      irpfRate: this.invoiceForm.get('irpfRate')?.value,
      ivaAmount: this.ivaAmount(),
      irpfAmount: this.irpfAmount(),
      total: this.totalInvoice()
    };

    if (this.invoice) {
      this.invoice = { ...this.invoice, ...invoiceData };
    } else {
      this.invoice = { ...invoiceData, id: crypto.randomUUID() };
    }
    this.invoicesService.setCurrentInvoice(this.invoice!);
    this.router.navigate(['/invoices', this.invoice!.id]);
  }

  cancelInvoice() {
    if (this.invoice) {
      this.router.navigate(['/invoices', this.invoice.id]);
    } else {
      this.router.navigate(['/clients', this.client()?.id]);
    }
  }

  addEmptyTimer() {
    this.clientTimers.update(timers => [
      ...timers,
      {
        commentary: '',
        elapsedTime: this.invoiceHelperService.formatHours(60),
        pricePerHour: this.client()?.pricePerHour || 0,
        invoiceId: this.invoiceForm.get('invoiceNumber')?.value,
        clientId: this.invoiceForm.get('client')?.value,
        formattedTime: '00:00',
        isRunning: false,
      }
    ]);
    this.updateTotals();
  }

  removeTimer(timerToRemove: Timer) {
    this.clientTimers.update(timers => timers.filter(timer => timer !== timerToRemove));
    this.updateTotals();
  }
}
