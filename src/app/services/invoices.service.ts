import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { Invoice } from '../interfaces';
import { map } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth-service.service';
import { SupabaseClient, User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {
  private currentInvoiceSubject: BehaviorSubject<Invoice | null> = new BehaviorSubject<Invoice | null>(null);
  public currentInvoice$: Observable<Invoice | null> = this.currentInvoiceSubject.asObservable();
  private supabase: SupabaseClient;
  private invoicesSubject: BehaviorSubject<Invoice[]> = new BehaviorSubject<Invoice[]>([]);
  public invoices$: Observable<Invoice[]> = this.invoicesSubject.asObservable();

  constructor(private authService: AuthService, private supabaseService: SupabaseService) { 
    this.supabase = this.supabaseService.getClient();
    this.loadInvoices(); // Load invoices when the service is instantiated
  }

  private async getAuthenticatedUser(): Promise<User> {
    const user = await firstValueFrom(this.authService.getCurrentUser());
    if (!user) throw new Error('No authenticated user');
    return user;
  }

  setCurrentInvoice(invoice: Invoice): void {
    this.currentInvoiceSubject.next(invoice);
  }

  getCurrentInvoice(): Observable<Invoice | null> {
    return this.currentInvoice$;
  }

  clearCurrentInvoice(): void {
    this.currentInvoiceSubject.next(null);
  }

  private async loadInvoices(): Promise<void> {
    try {
      const invoices = await this.fetchInvoices();
      this.invoicesSubject.next(invoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
      // Optionally, you can emit an empty array or keep the current value
      // this.invoicesSubject.next([]);
    }
  }

  private async fetchInvoices(): Promise<Invoice[]> {
    const user = await this.getAuthenticatedUser();
    const { data, error } = await this.supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    return data as Invoice[];
  }

  getInvoices(): Observable<Invoice[]> {
    return this.invoices$;
  }

  async refreshInvoices(): Promise<void> {
    await this.loadInvoices();
  }

  async saveInvoice(invoice: Invoice): Promise<void> {
    const user = await this.getAuthenticatedUser();

    const { data, error } = await this.supabase
      .from('invoices')
      .upsert({...invoice, user_id: user.id});

    if (error) throw error;
    
    // Refresh the invoices after saving
    await this.refreshInvoices();
  }

  // Fetch invoice by id
  async getInvoiceById(invoiceId: string): Promise<Invoice | null> {
    const user = await this.getAuthenticatedUser();
    const { data, error } = await this.supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .eq('user_id', user.id);

    if (error) throw error;
    return data ? data[0] as Invoice : null;
  }

  // Remove invoice by id
  async removeInvoiceById(invoiceId: string): Promise<void> {
    const user = await this.getAuthenticatedUser();
    const { error } = await this.supabase
      .from('invoices')
      .delete()
      .eq('id', invoiceId)
      .eq('user_id', user.id);

    if (error) throw error;

    // Refresh the invoices after removing
    await this.refreshInvoices();
  }

}
