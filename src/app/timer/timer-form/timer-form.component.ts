import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Client } from '../../interfaces';

@Component({
  selector: 'app-timer-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="modal">
      <div class="modal-content">
        <h2>New Timer Entry</h2>
        <label for="client">Client:</label>
        <select id="client" [(ngModel)]="selectedClient">
          @for (client of clients; track client.id) {
            <option [ngValue]="client">{{client.name}}</option>
          }
        </select>

        <label for="commentary">Comentario (optional):</label>
        <textarea id="commentary" [(ngModel)]="commentary"></textarea>

        <label for="time">Tiempo (minutes):</label>
        <input type="number" id="time" [(ngModel)]="time" min="0">

        <button (click)="saveEntry()">Empezar</button>
        <button (click)="closeModal()">Cancelar</button>
      </div>
    </div>
  `,
  styles: `
    .modal {
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0,0,0,0.4);
    }
    .modal-content {
      background-color: #fefefe;
      margin: 15% auto;
      padding: 20px;
      border: 1px solid #888;
      width: 80%;
    }
  `
})
export class TimerFormComponent {
  @Input() clients: Client[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{client: Client, commentary: string, time: number}>();

  selectedClient: Client | null = null;
  commentary = '';
  time = 0;

  closeModal() {
    this.close.emit();
  }

  saveEntry() {
    if (this.selectedClient) {
      this.save.emit({
        client: this.selectedClient,
        commentary: this.commentary,
        time: this.time
      });
    }
  }
}
