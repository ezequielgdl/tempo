import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { UserInfo } from '../interfaces';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, shareReplay, switchMap, tap, catchError, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private supabase: SupabaseClient;
  private userSubject = new BehaviorSubject<UserInfo | null>(null);
  private user$: Observable<UserInfo | null>;

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();

    this.user$ = this.userSubject.pipe(
      switchMap(user => user ? of(user) : this.fetchUser()),
      shareReplay(1)
    );
  }

  getUser(): Observable<UserInfo | null> {
    return this.user$;
  }

  createUser(userData: UserInfo): Observable<UserInfo> {
    return from(this.supabase
      .from('users')
      .insert(userData)
      .select()
      .single()
    ).pipe(
      map((response) => {
        if (!response) throw new Error('No response');
        const { data, error } = response;
        if (error) throw error;
        return data as UserInfo;
      }),
      tap(user => this.userSubject.next(user)),
      catchError(error => {
        console.error('Error creating user:', error);
        throw error;
      })
    );
  }

  updateUser(userId: string, userData: Partial<UserInfo>): Observable<UserInfo> {
    return from(this.supabase
      .from('users')
      .update(userData)
      .eq('id', userId)
      .select()
      .single()
    ).pipe(
      map((response) => {
        if (!response) throw new Error('No response');
        const { data, error } = response;
        if (error) throw error;
        return data as UserInfo;
      }),
      tap(user => this.userSubject.next(user)),
      catchError(error => {
        console.error('Error updating user:', error);
        throw error;
      })
    );
  }

  updateOrCreateUser(userId: string, userData: Partial<UserInfo>): Observable<UserInfo> {
    return this.getUser().pipe(
      take(1),
      switchMap(existingUser => {
        if (existingUser) {
          return this.updateUser(userId, userData);
        } else {
          return this.createUser({ id: userId, ...userData } as UserInfo);
        }
      })
    );
  }

  private fetchUser(): Observable<UserInfo | null> {
    return from(this.supabase.auth.getUser()).pipe(
      switchMap(({ data: { user } }) => {
        if (!user) return of(null);
        return this.supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
      }),
      map((response) => {
        if (!response) throw new Error('No response');
        const { data, error } = response;
        if (error) throw error;
        return data as UserInfo;
      }),
      tap(user => {
        if (user && !this.userSubject.value) {
          this.userSubject.next(user);
        }
      }),
      catchError(error => {
        console.error('Error fetching user:', error);
        return of(null);
      })
    );
  }
}
