import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Client } from '../interfaces';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private supabase: SupabaseClient;
  private clientsSubject = new BehaviorSubject<Client[] | null>(null);
  private clients$: Observable<Client[]>;

  constructor() {
    this.supabase = createClient(
      'https://bexfekwgojnzkyeeaxkf.supabase.co/',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJleGZla3dnb2puemt5ZWVheGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4NzI1NzQsImV4cCI6MjA0MTQ0ODU3NH0.OOLyiykZLUn8qKWcfW7kvpGOov1T5FG96uPxgjlo-Fw'
    );

    this.clients$ = this.clientsSubject.pipe(
      switchMap(clients => clients ? of(clients) : this.fetchClients()),
      shareReplay(1)
    );
  }

  getClients(): Observable<Client[]> {
    return this.clients$;
  }

  getClient(id: string): Observable<Client | null> {
    return this.clients$.pipe(
      map(clients => clients.find(client => client.id === id) || null)
    );
  }

  createClient(client: Omit<Client, 'id' | 'user_id'>): Observable<Client> {
    return from(this.supabase
      .from('clients')
      .insert(client)
      .select()
      .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Client;
      }),
      tap(newClient => {
        const currentClients = this.clientsSubject.value;
        this.clientsSubject.next([...(currentClients || []), newClient]);
      })
    );
  }

  updateClient(id: string, client: Partial<Client>): Observable<Client> {
    return from(this.supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Client;
      }),
      tap(updatedClient => {
        const currentClients = this.clientsSubject.value;
        if (currentClients) {
          const updatedClients = currentClients.map(c => 
            c.id === id ? { ...c, ...updatedClient } : c
          );
          this.clientsSubject.next(updatedClients);
        }
      })
    );
  }

  deleteClient(id: string): Observable<void> {
    return from(this.supabase.auth.getUser()).pipe(
      switchMap(({ data: { user } }) => {
        if (!user) throw new Error('No authenticated user');
        return this.supabase
          .from('clients')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
      }),
      map(({ error }) => {
        if (error) throw error;
      }),
      tap(() => {
        const currentClients = this.clientsSubject.value;
        if (currentClients) {
          const updatedClients = currentClients.filter(c => c.id !== id);
          this.clientsSubject.next(updatedClients);
        }
      })
    );
  }

  private fetchClients(): Observable<Client[]> {
    return from(this.supabase.auth.getUser()).pipe(
      switchMap(({ data: { user } }) => {
        if (!user) throw new Error('No authenticated user');
        return this.supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id);
      }),
      map(({ data, error }) => {
        if (error) throw error;
        return data as Client[];
      }),
      tap(clients => this.clientsSubject.next(clients))
    );
  }
}
