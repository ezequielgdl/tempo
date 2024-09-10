import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Observable, of, from } from 'rxjs';
import { map, catchError, shareReplay, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private currentUser$: Observable<User | null>;

  constructor() {
    this.supabase = createClient(
      'https://bexfekwgojnzkyeeaxkf.supabase.co/', 
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJleGZla3dnb2puemt5ZWVheGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4NzI1NzQsImV4cCI6MjA0MTQ0ODU3NH0.OOLyiykZLUn8qKWcfW7kvpGOov1T5FG96uPxgjlo-Fw'
    );
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
