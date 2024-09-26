import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Invoice } from '../interfaces';
import { firstValueFrom } from 'rxjs';
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

  constructor(private authService: AuthService, private supabaseService: SupabaseService) { 
    this.supabase = this.supabaseService.getClient();
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

  async saveInvoice(invoice: Invoice): Promise<void> {
    const user = await this.getAuthenticatedUser();

    const { data, error } = await this.supabase
      .from('invoices')
      .upsert({...invoice, user_id: user.id});

    if (error) throw error;
  }

  async getInvoices(): Promise<Invoice[]> {
    const user = await this.getAuthenticatedUser();
    const { data, error } = await this.supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    return data as Invoice[];
  }
}