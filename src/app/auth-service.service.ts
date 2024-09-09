import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private currentUser: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private lastCheck: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  constructor(private router: Router) {
    this.supabase = createClient(
      'https://bexfekwgojnzkyeeaxkf.supabase.co/', 
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJleGZla3dnb2puemt5ZWVheGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4NzI1NzQsImV4cCI6MjA0MTQ0ODU3NH0.OOLyiykZLUn8qKWcfW7kvpGOov1T5FG96uPxgjlo-Fw');
    this.initializeAuthState();
  }

  private async initializeAuthState(): Promise<void> {
    const user = await this.fetchCurrentUser();
    this.currentUser.next(user);
  }

  async login(email: string, password: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword(
        { email, password }
      );
      if (error) {
        return null;
      }
      const user = data.user ?? null;
      this.currentUser.next(user);
      this.lastCheck = Date.now();
      return user;
    } catch (error) {
      return null;
    }
  }

  async signUp(email: string, password: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase.auth.signUp(
        { email, password }
      );
      if (error) {
        console.error('Error signing up:', error.message);
        return null;
      }
      const user = data.user ?? null;
      this.currentUser.next(user);
      this.lastCheck = Date.now();
      return user;
    } catch (error) {
      console.error('Error signing up:', error);
      return null;
    }
  }

  async isLoggedIn(): Promise<User | null> {
    const cachedUser = this.currentUser.getValue();
    if (cachedUser && Date.now() - this.lastCheck < this.CACHE_DURATION) {
      return cachedUser;
    }

    const user = await this.fetchCurrentUser();
    this.currentUser.next(user);
    this.lastCheck = Date.now();
    return user;
  }

  private async fetchCurrentUser(): Promise<User | null> {
    try {
      const response = await this.supabase.auth.getUser();
      if (
        response.error &&
        response.error.message === 'Auth session missing!'
      ) {
        return null;
      }
      return response.data?.user ?? null;
    } catch (error) {
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error.message);
      }
      this.currentUser.next(null);
      this.lastCheck = 0;
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }
}
