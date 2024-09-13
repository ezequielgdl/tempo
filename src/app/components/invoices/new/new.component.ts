import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Timer } from '../../../interfaces';
import { ClientTimersService } from '../../../services/client-timers.service';
import { TimerService } from '../../../services/timer.service';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="invoiceForm" (ngSubmit)="onSubmit()">
      <div>
        <div>
          <label>
            <input type="radio" formControlName="invoiceType" value="all">
            Todas las horas sin facturar
          </label>
        </div>
        <div>
          <label>
            <input type="radio" formControlName="invoiceType" value="specific">
            Horas sin facturar de
          </label>
        </div>
      </div>
      <div>
        <select formControlName="timePeriod">
          <option value="thisMonth">Este mes</option>
          <option value="lastMonth">El mes pasado</option>
          <option value="thisQuarter">Este cuatrimestre</option>
          <option value="lastQuarter">El cuatrimestre pasado</option>
          <option value="thisYear">Este año</option>
          <option value="lastYear">El año pasado</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      @if (invoiceForm.get('timePeriod')?.value === 'custom') {
        <div>
          <label for="startDate">Desde:</label>
          <input type="date" id="startDate" formControlName="startDate">
        </div>
        <div>
          <label for="endDate">Hasta:</label>
          <input type="date" id="endDate" formControlName="endDate">
        </div>
      }
      <button class="button-base button-primary" type="submit">Generar factura</button>
    </form>
  `,
  styles: ``
})
export class NewInvoiceComponent implements OnInit {
  private clientId: string = '';
  clientTimers: Timer[] = [];
  invoiceForm: FormGroup;
  private firstDayOfMonth: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  private lastDayOfMonth: Date = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  private firstDayOfLastMonth: Date = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
  private lastDayOfLastMonth: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
  private firstDayOfQuarter: Date = new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3, 1);
  private lastDayOfQuarter: Date = new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3 + 2, 31);
  private firstDayOfYear: Date = new Date(new Date().getFullYear(), 0, 1);
  private lastDayOfYear: Date = new Date(new Date().getFullYear(), 11, 31);
  private firstDayOfLastYear: Date = new Date(new Date().getFullYear() - 1, 0, 1);
  private lastDayOfLastYear: Date = new Date(new Date().getFullYear() - 1, 11, 31);

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private timerService: TimerService,
    private clientTimersService: ClientTimersService,
    private router: Router
  ) {
    this.invoiceForm = this.fb.group({
      invoiceType: ['all'],
      timePeriod: ['thisMonth'],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: { [key: string]: string }) => {
      this.clientId = params['id'];
    });
  }

  onSubmit() {
    const invoiceType = this.invoiceForm.get('invoiceType')?.value;
    const timePeriod = this.invoiceForm.get('timePeriod')?.value;

    if (invoiceType === 'all') {
      this.getAllUninvoicedTimers();
    } else if (invoiceType === 'specific') {
      const { startDate, endDate } = this.getDateRange(timePeriod);
      this.getAllUninvoicedTimersByDate(startDate, endDate);
    }

     this.router.navigate(['/invoices', this.clientId, 'edit']);
  }

  getDateRange(timePeriod: string): { startDate: Date, endDate: Date } {
    const now = new Date();
    switch (timePeriod) {
      case 'thisMonth':
        return { startDate: this.firstDayOfMonth, endDate: this.lastDayOfMonth };
      case 'lastMonth':
        return { startDate: this.firstDayOfLastMonth, endDate: this.lastDayOfLastMonth };
      case 'thisQuarter':
        return { startDate: this.firstDayOfQuarter, endDate: this.lastDayOfQuarter };
      case 'lastQuarter':
        const lastQuarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 - 3, 1);
        const lastQuarterEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 0);
        return { startDate: lastQuarterStart, endDate: lastQuarterEnd };
      case 'thisYear':
        return { startDate: this.firstDayOfYear, endDate: this.lastDayOfYear };
      case 'lastYear':
        return { startDate: this.firstDayOfLastYear, endDate: this.lastDayOfLastYear };
      case 'custom':
        return { startDate: this.invoiceForm.get('startDate')?.value, endDate: this.invoiceForm.get('endDate')?.value };  
      default:
        return { startDate: this.firstDayOfMonth, endDate: this.lastDayOfMonth };
    }
  }

  async getAllUninvoicedTimersByDate(firstDay: Date, lastDay: Date) {
    this.clientTimers = await this.timerService.getClientUninvoicedTimersByDate(this.clientId, firstDay, lastDay);
    this.clientTimersService.setClientTimers(this.clientTimers);
  }

  async getAllUninvoicedTimers() {
    this.clientTimers = await this.timerService.getAllUninvoicedTimers();
    this.clientTimersService.setClientTimers(this.clientTimers);
  }
}
