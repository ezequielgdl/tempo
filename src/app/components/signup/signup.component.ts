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
          @if (errorMessage) {
            <p class="text-amber-400">{{ errorMessage }}</p>
          }
          @if (signupForm.get('email')?.hasError('required') && signupForm.get('email')?.touched) {
            <p class="text-amber-400">El email es requerido.</p>
          }
          @if (signupForm.get('email')?.hasError('email') && signupForm.get('email')?.touched) {
            <p class="text-amber-400">Por favor, ingrese un email válido.</p>
          }
          @if (signupForm.get('password')?.hasError('required') && signupForm.get('password')?.touched) {
            <p class="text-amber-400">La contraseña es requerida.</p>
          }
          @if (signupForm.get('password')?.hasError('minlength') && signupForm.get('password')?.touched) {
            <p class="text-amber-400">La contraseña debe tener al menos 6 caracteres.</p>
          }
          <button class="button-base button-secondary w-full" type="submit" [disabled]="!signupForm.valid">Registrarse</button>
        </form>
      </div>
    </div>
  `,
  styles: ``
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';
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

  onSubmit() {
    if (this.signupForm.valid) {
      try {
        const { email, password } = this.signupForm.value;
        this.authService.signUp(email, password).subscribe((next) => {
          if (next) {
            this.router.navigate(['/login']);
          } else {
            this.errorMessage = 'Email o contraseña incorrectos';
          }
        });
      } catch (error) {
        console.error('Error signing up:', error);
      }
    }
  }
}
