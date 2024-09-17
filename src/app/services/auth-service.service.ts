import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    from(this.supabase.auth.getSession()).pipe(
      map(({ data }) => data.session?.user ?? null),
      catchError(() => of(null))
    ).subscribe(user => this.currentUserSubject.next(user));

    this.supabase.auth.onAuthStateChange((_, session) => {
      this.currentUserSubject.next(session?.user ?? null);
    });
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  login(email: string, password: string): Observable<User | null> {
    return from(this.supabase.auth.signInWithPassword({ email, password })).pipe(
      map(({ data }) => data.user),
      tap(user => this.currentUserSubject.next(user)),
      catchError((error) => {
        console.error('Error logging in:', error);
        return of(null);
      })
    );
  }

  signUp(email: string, password: string): Observable<User | null> {
    return from(this.supabase.auth.signUp({ email, password })).pipe(
      map(({ data }) => data.user),
      tap(user => this.currentUserSubject.next(user)),
      catchError((error) => {
        console.error('Error signing up:', error);
        return of(null);
      })
    );
  }

  logout(): Observable<void> {
    return from(this.supabase.auth.signOut()).pipe(
      tap(() => this.currentUserSubject.next(null)),
      catchError((error) => {
        console.error('Error logging out:', error);
        return of(void 0);
      }),
      map(() => void 0)
    );
  }
}
