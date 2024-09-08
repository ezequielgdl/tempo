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
        <h2>Nuevo Timer</h2>
        <label for="client">Cliente:</label>
        <select id="client" [(ngModel)]="selectedClient">
          @for (client of clients; track client.id) {
            <option [ngValue]="client">{{client.name}}</option>
          }
        </select>

        <label for="commentary">Comentario (optional):</label>
        <textarea id="commentary" [(ngModel)]="commentary"></textarea>

        <label for="time">Tiempo (HH:MM):</label>
        <input type="text" id="time" [(ngModel)]="time" placeholder="00:00" pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$">

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
  @Output() save = new EventEmitter<{client: Client, commentary: string, time: string}>();

  selectedClient: Client | null = null;
  commentary = '';
  time = '00:00';

  closeModal() {
    this.close.emit();
  }

  saveEntry() {
    if (this.selectedClient) {
      const formattedTime = this.formatTime(this.time);
      this.save.emit({
        client: this.selectedClient,
        commentary: this.commentary,
        time: formattedTime,
      });
    }
  }

  private formatTime(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const formattedHours = Math.floor(totalMinutes / 60);
    const formattedMinutes = totalMinutes % 60;
    return `${formattedHours.toString().padStart(2, '0')}:${formattedMinutes.toString().padStart(2, '0')}`;
  }
}
