import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Client } from '../../interfaces';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="clientForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="name">Nombre:</label>
        <input id="name" type="text" formControlName="name">
      </div>
      <div>
        <label for="email">Email:</label>
        <input id="email" type="email" formControlName="email">
      </div>
      <div>
        <label for="phone">Teléfono:</label>
        <input id="phone" type="tel" formControlName="phone">
      </div>
      <div>
        <label for="address">Dirección:</label>
        <input id="address" type="text" formControlName="address">
      </div>
      <button type="submit">Save</button>
    </form>
  `,
  styles: ``
})
export class NewComponent {
  clientForm: FormGroup;
  newClient: Client | null = null;

  constructor(private fb: FormBuilder) {
    this.clientForm = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
      address: ['']
    });
  }

  onSubmit() {
    if (this.clientForm.valid) {
      this.newClient = {
        id: 0, // This should be handled by the backend
        name: this.clientForm.get('name')?.value,
        email: this.clientForm.get('email')?.value,
        phone: this.clientForm.get('phone')?.value,
        address: this.clientForm.get('address')?.value,
      };
      console.log('New client:', this.newClient);
      // Here you would typically call a service to save the new client
    }
  }
}
