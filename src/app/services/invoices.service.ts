import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Invoice } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {
  private currentInvoiceSubject: BehaviorSubject<Invoice | null> = new BehaviorSubject<Invoice | null>(null);
  public currentInvoice$: Observable<Invoice | null> = this.currentInvoiceSubject.asObservable();

  constructor() { }

  setCurrentInvoice(invoice: Invoice): void {
    this.currentInvoiceSubject.next(invoice);
  }

  getCurrentInvoice(): Observable<Invoice | null> {
    return this.currentInvoice$;
  }

  clearCurrentInvoice(): void {
    this.currentInvoiceSubject.next(null);
  }

}
