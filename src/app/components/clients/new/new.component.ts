import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

import { Client } from '../../../interfaces';
import { AuthService } from '../../../services/auth-service.service';
import { ClientService } from '../../../services/client.service';
import { ToastService } from '../../../ui/toast/toast.service';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <form [formGroup]="clientForm" (ngSubmit)="onSubmit()" class="max-w-md mx-auto p-4 bg-primary-darker rounded-lg shadow-md border border-off-white">
        <h1 class="text-2xl font-bold mb-4 text-off-white">Nuevo Cliente</h1>
        <div class="mb-4">
          <label for="name" class="block text-off-white font-bold mb-2">Nombre:</label>
          <input id="name" type="text" formControlName="name" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-primary-dark text-off-white">
          @if (clientForm.get('name')?.invalid && clientForm.get('name')?.touched) {
            <div class="text-off-white text-sm mt-1">El nombre es requerido</div>
          }
        </div>
        <div class="mb-4">
          <label for="address" class="block text-off-white font-bold mb-2">Dirección:</label>
          <input id="address" type="text" formControlName="address" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-primary-dark text-off-white">
          @if (clientForm.get('address')?.invalid && clientForm.get('address')?.touched) {
            <div class="text-off-white text-sm mt-1">La dirección es requerida</div>
          }
        </div>
        <div class="mb-4">
          <label for="email" class="block text-off-white font-bold mb-2">Email:</label>
          <input id="email" type="email" formControlName="email" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-primary-dark text-off-white">
          @if (clientForm.get('email')?.invalid && clientForm.get('email')?.touched) {
            <div class="text-off-white text-sm mt-1">Email es requerido</div>
          }
        </div>
        <div class="mb-4">
          <label for="phone" class="block text-off-white font-bold mb-2">Teléfono:</label>
          <input id="phone" type="tel" formControlName="phone" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-primary-dark text-off-white">
          @if (clientForm.get('phone')?.invalid && clientForm.get('phone')?.touched) {
            <div class="text-off-white text-sm mt-1">Teléfono es requerido</div>
          }
        </div>
        <div class="mb-6">
          <label for="pricePerHour" class="block text-off-white font-bold mb-2">Precio por hora:</label>
          <input id="pricePerHour" type="number" formControlName="pricePerHour" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-primary-dark text-off-white">
          @if (clientForm.get('pricePerHour')?.invalid && clientForm.get('pricePerHour')?.touched) {
            <div class="text-off-white text-sm mt-1">Precio por hora es requerido</div>
          }
        </div>

        <div class="flex justify-between">
          <button class="button-base button-secondary w-full sm:w-auto mr-2" type="submit" [disabled]="clientForm.invalid">Guardar</button>
          <button class="button-base button-cancel w-full sm:w-auto" type="button" routerLink="/clients">Cancelar</button>
        </div>
      </form>
    </div>
  `,
  styles: ``
})
export class NewComponent implements OnDestroy {
  clientForm: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private clientService: ClientService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      pricePerHour: [0, Validators.required]
    });
  }

  onSubmit() {
    if (this.clientForm.valid) {
      this.clientService.createClient(this.clientForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (client) => {
            this.toastService.show('Cliente creado exitosamente', 'success');
            this.router.navigate(['/clients']);
          },
          error: (error) => {
            console.error('Error creating client:', error);
            this.toastService.show('Error al crear el cliente', 'error');
          }
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
