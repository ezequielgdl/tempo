import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2>Login</h2>
      <button (click)="signInWithGoogle()">Sign in with Google</button>
      <button (click)="signInWithGithub()">Sign in with GitHub</button>
    </div>
  `,
  styles: ``
})
export class LoginComponent {
  constructor(private supabase: AuthService, private router: Router) {}

  async signInWithGoogle() {
    try {
      await this.supabase.signInWithGoogle();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  }

  async signInWithGithub() {
    try {
      await this.supabase.signInWithGithub();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
    }
  }
}
