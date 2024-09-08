import { Component } from '@angular/core';
import { TimerFormComponent } from './timer-form/timer-form.component';
import { Client } from '../interfaces';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [TimerFormComponent],
  template: `
    <button (click)="openModal()">+</button>

    @if (showModal) {
      <app-timer-form
        [clients]="clients"
        (close)="closeModal()"
        (save)="saveEntry($event)"
      ></app-timer-form>
    }
  `,
  styles: ``
})
export class TimerComponent {
  showModal = false;
  clients: Client[] = [{
    id: 1, name: 'Client 1',
    email: '',
    phone: '',
    address: ''
  }, {
    id: 2, name: 'Client 2',
    email: '',
    phone: '',
    address: ''
  }]; // This should be populated with actual client data

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveEntry(entry: {client: Client, commentary: string, time: number}) {
    console.log('Entry saved:', entry);
    this.closeModal();
  }
}
