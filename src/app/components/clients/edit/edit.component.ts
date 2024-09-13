import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Client } from '../../../interfaces';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <form [formGroup]="clientForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="name">Nombre:</label>
        <input id="name" type="text" formControlName="name">
        @if (clientForm.get('name')?.invalid && clientForm.get('name')?.touched) {
          <div>El nombre es requerido</div>
        }
      </div>
      <div>
        <label for="address">Dirección:</label>
        <input id="address" type="text" formControlName="address">
        @if (clientForm.get('address')?.invalid && clientForm.get('address')?.touched) {
          <div>La dirección es requerida</div>
        }
      </div>
      <div>
        <label for="email">Email:</label>
        <input id="email" type="email" formControlName="email">
        @if (clientForm.get('email')?.invalid && clientForm.get('email')?.touched) {
          <div>Email es requerido</div>
        }
      </div>
      <div>
        <label for="phone">Teléfono:</label>
        <input id="phone" type="tel" formControlName="phone">
        @if (clientForm.get('phone')?.invalid && clientForm.get('phone')?.touched) {
          <div>Teléfono es requerido</div>
        }
      </div>

      <button type="submit" [disabled]="clientForm.invalid" class="button-base button-primary">Update</button>
      <button type="button" routerLink="/clients" class="button-base button-secondary">Cancel</button>
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
    private clientService: ClientService
  ) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required]
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
        },
        error: (error) => {
          console.error('Error updating client:', error);
        }
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
