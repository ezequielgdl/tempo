import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private currentUser$: Observable<User | null>;

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();
    this.currentUser$ = this.initializeAuthState().pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  private initializeAuthState(): Observable<User | null> {
    return from(this.supabase.auth.getSession()).pipe(
      map(({ data }) => data.session?.user ?? null),
      catchError(() => of(null))
    );
  }

  login(email: string, password: string): Observable<User | null> {
    return from(this.supabase.auth.signInWithPassword({ email, password })).pipe(
      map(({ data }) => data.user),
      catchError((error) => {
        console.error('Error logging in:', error);
        return of(null);
      }),
      switchMap(() => this.currentUser$)
    );
  }

  signUp(email: string, password: string): Observable<User | null> {
    return from(this.supabase.auth.signUp({ email, password })).pipe(
      map(({ data }) => data.user),
      catchError((error) => {
        console.error('Error signing up:', error);
        return of(null);
      }),
      switchMap(() => this.currentUser$)
    );
  }

  logout(): Observable<void> {
    return from(this.supabase.auth.signOut()).pipe(
      catchError((error) => {
        console.error('Error logging out:', error);
        return of(void 0);
      }),
      map(() => void 0)
    );
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }
}
