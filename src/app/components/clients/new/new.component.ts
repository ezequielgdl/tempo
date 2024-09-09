import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client } from '../../../interfaces';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new',
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

      <button type="submit" [disabled]="clientForm.invalid">Save</button>
      <button type="button" routerLink="/clients">Cancel</button>
    </form>
  `,
  styles: ``
})
export class NewComponent {
  clientForm: FormGroup;
  newClient: Client | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.clientForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    if (this.clientForm.valid) {
      this.newClient = {
        id: '', // This should be handled by the backend
        name: this.clientForm.controls['name'].value,
        email: this.clientForm.controls['email'].value,
        phone: this.clientForm.controls['phone'].value,
        address: this.clientForm.controls['address'].value,
      };
      console.log('New client:', this.newClient);
      // Here you would typically call a service to save the new client
      
      // After saving the client, route back to /clients
      this.router.navigate(['/clients']);
    } 
  }
}
