import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, shareReplay, switchMap, tap, catchError } from 'rxjs/operators';
import { SupabaseClient } from '@supabase/supabase-js';
import { Client } from '../interfaces';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private supabase: SupabaseClient;
  private clientsSubject = new BehaviorSubject<Client[] | null>(null);
  private clients$: Observable<Client[]>;

  constructor(private supabaseService: SupabaseService, private authService: AuthService) {
    this.supabase = this.supabaseService.getClient();

    this.clients$ = this.clientsSubject.pipe(
      switchMap(clients => clients ? of(clients) : this.fetchClients()),
      shareReplay(1)
    );
  }

  getClients(): Observable<Client[]> {
    return this.clients$;
  }

  getClient(id: string): Observable<Client | null> {
    return from(this.supabaseService.getClient().from('clients').select('*').eq('id', id).single()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Client;
      }),
      catchError((error) => {
        console.error('Error fetching client:', error);
        return of(null);
      })
    );
  }

  createClient(client: Omit<Client, 'id' | 'user_id'>): Observable<Client | null> {
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
      }),
      catchError((error) => {
        console.error('Error creating client:', error);
        return of(null);
      })
    );
  }

  updateClient(id: string, client: Partial<Client>): Observable<Client | null> {
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
      }),
      catchError((error) => {
        console.error('Error updating client:', error);
        return of(null);
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
      }),
      catchError((error) => {
        console.error('Error deleting client:', error);
        throw error; 
      })
    );
  }

  private fetchClients(): Observable<Client[]> {
    return from(this.authService.getCurrentUser()).pipe(
      switchMap(user => {
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
