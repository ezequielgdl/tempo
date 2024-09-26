import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div class="max-w-md mx-auto bg-primary-darker rounded-lg shadow border border-off-white p-6">
        <h2 class="text-2xl sm:text-3xl mb-6 text-center text-off-white">Registrarse</h2>
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="email" class="block text-off-white mb-2">Email:</label>
            <input type="email" id="email" formControlName="email" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-primary-dark text-off-white">
          </div>
          <div>
            <label for="password" class="block text-off-white mb-2">Password:</label>
            <input type="password" id="password" formControlName="password" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-primary-dark text-off-white">
          </div>
          <button class="button-base button-secondary w-full" type="submit" [disabled]="!signupForm.valid">Sign Up</button>
        </form>
      </div>
    </div>
  `,
  styles: ``
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.signupForm.valid) {
      try {
        const { email, password } = this.signupForm.value;
        await this.authService.signUp(email, password);
        // After successful signup, navigate to login page
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Error signing up:', error);
      }
    }
  }
}
