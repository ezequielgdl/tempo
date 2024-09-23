import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Invoice } from '../interfaces';
import { Timer } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class InvoiceHelperService {
  constructor() {}

  getDateRange(timePeriod: string, now: Date): { startDate: Date, endDate: Date } {
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const firstDayOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    const lastDayOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 2, 31);
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const lastDayOfYear = new Date(now.getFullYear(), 11, 31);
    const firstDayOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
    const lastDayOfLastYear = new Date(now.getFullYear() - 1, 11, 31);

    switch (timePeriod) {
      case 'thisMonth':
        return { startDate: firstDayOfMonth, endDate: lastDayOfMonth };
      case 'lastMonth':
        return { startDate: firstDayOfLastMonth, endDate: lastDayOfLastMonth };
      case 'thisQuarter':
        return { startDate: firstDayOfQuarter, endDate: lastDayOfQuarter };
      case 'lastQuarter':
        const lastQuarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 - 3, 1);
        const lastQuarterEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 0);
        return { startDate: lastQuarterStart, endDate: lastQuarterEnd };
      case 'thisYear':
        return { startDate: firstDayOfYear, endDate: lastDayOfYear };
      case 'lastYear':
        return { startDate: firstDayOfLastYear, endDate: lastDayOfLastYear };
      case 'custom':
        return { startDate: new Date(), endDate: new Date() }; // Placeholder, should be replaced with actual custom dates
      default:
        return { startDate: firstDayOfMonth, endDate: lastDayOfMonth };
    }
  }

  formatHours(minutes: number): number {
    return Number((minutes / 60).toFixed(2));
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  populateFormWithInvoice(invoiceForm: FormGroup, invoice: Invoice) {
    invoiceForm.patchValue({
      invoiceNumber: invoice.invoiceNumber,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      client: invoice.clientName,
      clientId: invoice.clientId,
      ivaRate: invoice.ivaRate,
      irpfRate: invoice.irpfRate,
      currency: invoice.currency,
      subject: invoice.subject,
      notes: invoice.notes
    });
  }

  calculateSubtotal(timers: Timer[]): number {
    return timers.reduce((acc, timer) => acc + (timer.elapsedTime * timer.pricePerHour), 0);
  }

  calculateIvaAndIrpf(subtotal: number, ivaRate: number, irpfRate: number): { ivaAmount: number, irpfAmount: number } {
    const ivaAmount = subtotal * ivaRate / 100;
    const irpfAmount = subtotal * irpfRate / 100;
    return { ivaAmount, irpfAmount };
  }

  calculateTotalInvoice(subtotal: number, ivaAmount: number, irpfAmount: number): number {
    return subtotal + ivaAmount - irpfAmount;
  }
}
