import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../interfaces';
import { CommonModule } from '@angular/common';

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

      <button type="submit" [disabled]="clientForm.invalid">Update</button>
      <button type="button" routerLink="/clients">Cancel</button>
    </form>
  `,
  styles: ``
})
export class EditComponent implements OnInit {
  clientForm: FormGroup;
  clientId: string | null = null;

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
    this.route.paramMap.subscribe(params => {
      this.clientId = params.get('id');
      if (this.clientId) {
        this.loadClient(this.clientId);
      }
    });
  }

  async loadClient(id: string) {
    try {
      const client = await this.clientService.getClient(id);
      if (client) {
        this.clientForm.patchValue(client);
      }
    } catch (error) {
      console.error('Error loading client:', error);
    }
  }

  async onSubmit() {
    if (this.clientForm.valid && this.clientId) {
      try {
        const updatedClient: Partial<Client> = this.clientForm.value;
        await this.clientService.updateClient(this.clientId, updatedClient);
        this.router.navigate(['/clients']);
      } catch (error) {
        console.error('Error updating client:', error);
      }
    }
  }
}
