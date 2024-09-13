import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  template: `
    <div class="max-w-md mx-auto p-4 bg-off-white rounded-lg shadow-md my-10 relative">
      <button (click)="signOut()" class="absolute top-4 right-4 text-sm text-primary hover:text-primary-dark flex items-center">
        <mat-icon class="mr-1">logout</mat-icon>
        <span>Cerrar sesión</span>
      </button>
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <h1 class="text-2xl font-bold mb-4 text-dark-gray">Perfil de Usuario</h1>
        <div class="mb-4">
          <label for="name" class="block text-dark-gray font-bold mb-2">Nombre:</label>
          <input id="name" type="text" formControlName="name" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        </div>
        <div class="mb-4">
          <label for="address" class="block text-dark-gray font-bold mb-2">Dirección:</label>
          <input id="address" type="text" formControlName="address" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        </div>
        <div class="mb-4">
          <label for="phone" class="block text-dark-gray font-bold mb-2">Teléfono:</label>
          <input id="phone" type="tel" formControlName="phone" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        </div>
        <div class="mb-4">
          <label for="website" class="block text-dark-gray font-bold mb-2">Sitio web:</label>
          <input id="website" type="url" formControlName="website" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        </div>
        <div class="mb-6">
          <label for="nif" class="block text-dark-gray font-bold mb-2">NIF:</label>
          <input id="nif" type="text" formControlName="nif" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        </div>
        <button type="submit" class="button-base button-primary w-full sm:w-auto">Guardar</button>
      </form>

      @if (submitError) {
        <p class="text-red-500 mt-4">{{ submitError }}</p>
      }
      @if (submitSuccess) {
        <p class="text-green-500 mt-4">¡Datos de usuario guardados exitosamente!</p>
      }
    </div>
  `,
  styles: `

  `
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  userId: string | null = null;
  submitError: string | null = null;
  submitSuccess: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private authService: AuthService, private router: Router) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-()]+$/)]],
      website: ['', [Validators.required]],
      nif: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user?.id) {
        this.userId = user.id;
        this.userService.getUser().subscribe({
          next: (userData) => {
            if (userData) {
              this.userForm.patchValue(userData);
            }
          },
          error: (error) => {
            console.error('Error fetching user data:', error);
            // User data doesn't exist, form will remain empty for new user
          }
        });
      }
    });
  }

  onSubmit() {
    this.submitError = null;
    this.submitSuccess = false;
    if (this.userForm.valid) {
      if (this.userId) {
        const userData = this.userForm.value;
        this.userService.updateOrCreateUser(this.userId, userData).subscribe({
          next: (response) => {
            this.userForm.markAsPristine();
            this.submitSuccess = true;
          },
          error: (error) => {
            console.error('Error saving user data', error);
            this.submitError = 'An error occurred while saving user data. Please try again.';
          }
        });
      } else {
        this.submitError = 'User ID is missing. Please try logging in again.';
      }
    } else {
      this.submitError = 'Please fill in all required fields correctly.';
    }
  }

  signOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}



