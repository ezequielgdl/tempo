import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-md mx-auto my-8 p-6 bg-white shadow-sm rounded-sm border border-gray-200">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label for="email" class="block text-dark-gray font-bold mb-2">Email:</label>
          <input type="email" id="email" formControlName="email" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        </div>
        <div>
          <label for="password" class="block text-dark-gray font-bold mb-2">Password:</label>
          <input type="password" id="password" formControlName="password" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        </div>
        <button class="button-base button-primary w-full" type="submit" [disabled]="!loginForm.valid">Login</button>
      </form>
    </div>
  `,
  styles: ``
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.login(email, password);
        this.router.navigate(['/clients']);
      } catch (error) {
        console.error('Error signing in:', error);
      }
    }
  }
}
