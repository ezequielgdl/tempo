import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://bexfekwgojnzkyeeaxkf.supabase.co/',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJleGZla3dnb2puemt5ZWVheGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4NzI1NzQsImV4cCI6MjA0MTQ0ODU3NH0.OOLyiykZLUn8qKWcfW7kvpGOov1T5FG96uPxgjlo-Fw'
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
