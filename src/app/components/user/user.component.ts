import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Observable, switchMap, of, catchError, map } from 'rxjs';
import { ToastService } from '../../ui/toast/toast.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  template: `
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div class="max-w-md mx-auto bg-primary-darker rounded-lg shadow border border-off-white p-6 relative">
        <button (click)="signOut()" class="absolute top-4 right-4 text-sm text-off-white hover:text-primary flex items-center">
          <mat-icon class="mr-1">logout</mat-icon>
          <span>Cerrar sesión</span>
        </button>
        <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
          <h2 class="text-2xl sm:text-3xl mb-4 sm:mb-6 text-off-white">Perfil de Usuario</h2>
          <div class="mb-4">
            <label for="name" class="block text-off-white font-bold mb-2">Nombre:</label>
            <input id="name" type="text" formControlName="name" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-primary-dark text-off-white">
          </div>
          <div class="mb-4">
            <label for="address" class="block text-off-white font-bold mb-2">Dirección:</label>
            <input id="address" type="text" formControlName="address" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-primary-dark text-off-white">
          </div>
          <div class="mb-4">
            <label for="phone" class="block text-off-white font-bold mb-2">Teléfono:</label>
            <input id="phone" type="tel" formControlName="phone" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-primary-dark text-off-white">
          </div>
          <div class="mb-4">
            <label for="website" class="block text-off-white font-bold mb-2">Sitio web:</label>
            <input id="website" type="url" formControlName="website" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-primary-dark text-off-white">
          </div>
          <div class="mb-6">
            <label for="nif" class="block text-off-white font-bold mb-2">NIF:</label>
            <input id="nif" type="text" formControlName="nif" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-primary-dark text-off-white">
          </div>
          <button type="submit" class="button-base button-secondary w-full sm:w-auto">Guardar</button>
        </form>
      </div>
    </div>
  `,
  styles: `

  `
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  userId$: Observable<string | null>;

  constructor(private fb: FormBuilder, private userService: UserService, private authService: AuthService, private router: Router, private toastService: ToastService) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-()]+$/)]],
      website: ['', [Validators.required]],
      nif: ['', [Validators.required]],
    });

    this.userId$ = this.authService.getCurrentUser().pipe(
      map(user => user?.id || null)
    );
  }

  ngOnInit() {
    this.userId$.pipe(
      switchMap(userId => userId ? this.userService.getUser() : of(null)),
      catchError(error => {
        console.error('Error fetching user data:', error);
        return of(null);
      })
    ).subscribe(userData => {
      if (userData) {
        this.userForm.patchValue(userData);
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.userId$.pipe(
        switchMap(userId => {
          if (!userId) {
            throw new Error('User ID is missing. Please try logging in again.');
          }
          return this.userService.updateOrCreateUser(userId, this.userForm.value);
        })
      ).subscribe({
        next: () => {
          this.userForm.markAsPristine();
          this.toastService.show('Datos de usuario guardados exitosamente', 'success');
        },
        error: (error) => {
          console.error('Error saving user data', error);
          this.toastService.show('Error guardando datos de usuario', 'error');
        }
      });
    } else {
      this.toastService.show('Por favor, rellena todos los campos correctamente.', 'info');
    }
  }

  signOut() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error signing out', error);
      }
    });
  }
}
