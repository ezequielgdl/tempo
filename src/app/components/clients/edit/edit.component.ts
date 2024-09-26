import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Client } from '../../../interfaces';
import { ClientService } from '../../../services/client.service';
import { ToastService } from '../../../ui/toast/toast.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <form [formGroup]="clientForm" (ngSubmit)="onSubmit()" class="max-w-md mx-auto p-4 bg-primary-darker rounded-lg shadow-md border border-off-white my-10">
      <h1 class="text-2xl font-bold mb-4 text-off-white">Editar Cliente</h1>
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
        <button type="submit" [disabled]="clientForm.invalid" class="button-base button-secondary w-full sm:w-auto mr-2">Actualizar</button>
        <button type="button" routerLink="/clients" class="button-base button-secondary w-full sm:w-auto">Cancelar</button>
      </div>
    </form>
  `,
  styles: ``
})
export class EditComponent implements OnInit, OnDestroy {
  clientForm: FormGroup;
  clientId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
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

  ngOnInit() {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.clientId = params.get('id');
      if (this.clientId) {
        this.loadClient(this.clientId);
      }
    });
  }

  loadClient(id: string) {
    this.clientService.getClient(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (client) => {
        if (client) {
          this.clientForm.patchValue(client);
        }
      },
      error: (error) => {
        console.error('Error loading client:', error);
      }
    });
  }

  onSubmit() {
    if (this.clientForm.valid && this.clientId) {
      const updatedClient: Partial<Client> = this.clientForm.value;
      this.clientService.updateClient(this.clientId, updatedClient).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.router.navigate(['/clients']);
          this.toastService.show('Cliente actualizado correctamente', 'success');
        },
        error: (error) => {
          console.error('Error updating client:', error);
          this.toastService.show('Error actualizando cliente', 'error');
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
