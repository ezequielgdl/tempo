import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client } from '../../../interfaces';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../services/client.service';
import { AuthService } from '../../../services/auth-service.service';
import { firstValueFrom } from 'rxjs';

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
      <div>
        <label for="pricePerHour">Precio por hora:</label>
        <input id="pricePerHour" type="number" formControlName="pricePerHour">
        @if (clientForm.get('pricePerHour')?.invalid && clientForm.get('pricePerHour')?.touched) {
          <div>Precio por hora es requerido</div>
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private clientService: ClientService,
    private authService: AuthService // Add this
  ) {
    this.clientForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      pricePerHour: new FormControl(0, Validators.required)
    });
  }

  async onSubmit() {
    if (this.clientForm.valid) {
      try {
        const user = await firstValueFrom(this.authService.getCurrentUser());
        if (!user) {
          return;
        }

        const newClient: Omit<Client, 'id'> = {
          name: this.clientForm.controls['name'].value,
          email: this.clientForm.controls['email'].value,
          phone: this.clientForm.controls['phone'].value,
          address: this.clientForm.controls['address'].value,
          user_id: user.id,
          pricePerHour: 0
        };

        const createdClient = await firstValueFrom(this.clientService.createClient(newClient));
        
        if (createdClient && createdClient.id) {
          this.router.navigate(['/clients']);
        } else {
          console.error('Error creating client: Client not created');
        }
      } catch (error) {
        console.error('Error creating client:', error);
      }
    } 
  }
}
