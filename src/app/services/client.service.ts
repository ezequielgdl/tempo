import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Client } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://bexfekwgojnzkyeeaxkf.supabase.co/',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJleGZla3dnb2puemt5ZWVheGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4NzI1NzQsImV4cCI6MjA0MTQ0ODU3NH0.OOLyiykZLUn8qKWcfW7kvpGOov1T5FG96uPxgjlo-Fw'
    );
  }

  async getClients(): Promise<Client[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id);
    if (error) throw error;
    return data as Client[];
  }

  async getClient(id: string): Promise<Client | null> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Client;
  }

  async createClient(client: Omit<Client, 'id' | 'user_id'>): Promise<Client> {
    const { data, error } = await this.supabase
      .from('clients')
      .insert(client)
      .select()
      .single();
    if (error) throw error;
    return data as Client;
  }

  async updateClient(id: string, client: Partial<Client>): Promise<Client> {
    const { data, error } = await this.supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Client;
  }

  async deleteClient(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('clients')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
