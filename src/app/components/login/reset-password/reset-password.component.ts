import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ValidatorFn, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../services/auth-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div class="max-w-md mx-auto bg-primary-darker rounded-lg shadow border border-off-white p-6">
        <h2 class="text-2xl sm:text-3xl mb-6 text-center text-off-white">Reset Password</h2>
        <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="password" class="block text-off-white mb-2">New Password:</label>
            <input type="password" id="password" formControlName="password" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-primary-dark text-off-white">
            @if (passwordForm.get('password')?.hasError('required') && passwordForm.get('password')?.touched) {
              <p class="text-amber-400">Por favor, introduce tu contraseña</p>
            }
            @if (passwordForm.get('password')?.hasError('minlength')) {
              <p class="text-amber-400">La contraseña debe tener al menos 6 caracteres</p>
            }
          </div>
          <div>
            <label for="confirmPassword" class="block text-off-white mb-2">Confirm Password:</label>
            <input type="password" id="confirmPassword" formControlName="confirmPassword" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-primary-dark text-off-white">
            @if (passwordForm.get('confirmPassword')?.hasError('required') && passwordForm.get('confirmPassword')?.touched) {
              <p class="text-amber-400">Por favor, confirma tu contraseña</p>
            }
          </div>
          @if (passwordForm.hasError('mismatch') && passwordForm.get('confirmPassword')?.touched) {
            <p class="text-amber-400">Las contraseñas no coinciden</p>
          }
          <button class="button-base button-secondary w-full" type="submit" [disabled]="!passwordForm.valid">Reset Password</button>
        </form>
      </div>
    </div>
  `,
  styles: ``
})
export class ResetPasswordComponent {

  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    return group.get('password')?.value === group.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  };

  passwordForm: FormGroup = new FormGroup({
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl<string>('', [Validators.required])
  }, { validators: this.passwordMatchValidator });

  onSubmit() {
    if (this.passwordForm.valid) {
      const newPassword = this.passwordForm.get('password')?.value;
      this.authService.updatePasswordWithToken(newPassword).subscribe({
        next: (user) => {
          if (user) {
            this.router.navigate(['/clients']);
          } else {
            this.errorMessage = 'No se pudo actualizar la contraseña. Por favor, intenta de nuevo.';
          }
        },
        error: (error) => {
          console.error('Error updating password:', error);
          this.errorMessage = 'Hubo un error al actualizar la contraseña. Por favor, intenta de nuevo.';
        }
      });
    }
  }
}