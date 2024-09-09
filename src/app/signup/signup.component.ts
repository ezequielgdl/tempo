import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div>
      <h2>Sign Up</h2>
      <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" formControlName="email" required>
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" formControlName="password" required>
        </div>
        <button type="submit" [disabled]="!signupForm.valid">Sign Up</button>
      </form>
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
