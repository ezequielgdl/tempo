import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    this.supabase = createClient(
      'https://bexfekwgojnzkyeeaxkf.supabase.co/', 
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJleGZla3dnb2puemt5ZWVheGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4NzI1NzQsImV4cCI6MjA0MTQ0ODU3NH0.OOLyiykZLUn8qKWcfW7kvpGOov1T5FG96uPxgjlo-Fw');
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();

    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        this.currentUserSubject.next(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        this.currentUserSubject.next(null);
      }
    });
  }

  async signInWithGoogle(): Promise<void> {
    await this.supabase.auth.signInWithOAuth({
      provider: 'google'
    });
  }

  async signInWithGithub(): Promise<void> {
    await this.supabase.auth.signInWithOAuth({
      provider: 'github'
    });
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
