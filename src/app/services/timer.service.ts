import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Timer } from '../interfaces';
import { AuthService } from './auth-service.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private supabase: SupabaseClient;

  constructor(private authService: AuthService) {
    this.supabase = createClient(
      'https://bexfekwgojnzkyeeaxkf.supabase.co/',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJleGZla3dnb2puemt5ZWVheGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4NzI1NzQsImV4cCI6MjA0MTQ0ODU3NH0.OOLyiykZLUn8qKWcfW7kvpGOov1T5FG96uPxgjlo-Fw'
    );
  }

  private async getAuthenticatedUser(): Promise<User> {
    const user = await firstValueFrom(this.authService.getCurrentUser());
    if (!user) throw new Error('No authenticated user');
    return user;
  }

  async getTimersToday(): Promise<Timer[]> {
    const user = await this.getAuthenticatedUser();
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await this.supabase
      .from('timers')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', today);

    if (error) throw error;
    return data as Timer[];
  }

  async getTimers(): Promise<Timer[]> {
    const user = await this.getAuthenticatedUser();
    const { data, error } = await this.supabase
      .from('timers')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    return data as Timer[];
  }

  async getClientTimers(clientId: string): Promise<Timer[]> {
    const user = await this.getAuthenticatedUser();
    const { data, error } = await this.supabase
      .from('timers')
      .select('*')
      .eq('client_id', clientId)
      .eq('user_id', user.id);
    if (error) throw error;
    return data as Timer[];
  }

  async getAllUninvoicedTimers(): Promise<Timer[]> {
    const user = await this.getAuthenticatedUser();
    const { data, error } = await this.supabase
      .from('timers')
      .select('*')
      .eq('user_id', user.id)
      .is('invoiceId', null);
    if (error) throw error;
    return data as Timer[];
  }
  
  async getClientUninvoicedTimersByDate(clientId: string, startDate: Date, endDate: Date): Promise<Timer[]> {
    const user = await this.getAuthenticatedUser();
    const { data, error } = await this.supabase
      .from('timers')
      .select('*')
      .eq('client_id', clientId)
      .eq('user_id', user.id)
      .is('invoiceId', null)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());
    
    if (error) throw error;
    return data as Timer[];
  }

  async createTimer(timer: Omit<Timer, 'id' | 'user_id'>): Promise<Timer> {
    const user = await this.getAuthenticatedUser();

    const { data, error } = await this.supabase
      .from('timers')
      .insert({ ...timer, user_id: user.id })
      .select()
      .single();
    if (error) throw error;
    return data as Timer;
  }

  async updateTimer(id: number, timer: Partial<Timer>): Promise<Timer> {
    const { data, error } = await this.supabase
      .from('timers')
      .update(timer)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Timer;
  }

  async deleteTimer(id: number): Promise<void> {
    const user = await this.getAuthenticatedUser();

    const { error } = await this.supabase
      .from('timers')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) throw error;
  }
}
