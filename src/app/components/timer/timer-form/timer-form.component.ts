import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Client } from '../../../interfaces';

@Component({
  selector: 'app-timer-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-off-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md mx-4">
        <h2 class="text-2xl font-bold mb-6 text-dark-gray">Nuevo Timer</h2>
        
        <div class="mb-4">
          <label for="client" class="block text-dark-gray font-bold mb-2">Cliente:</label>
          <select id="client" [(ngModel)]="selectedClient" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            @for (client of clients; track client.id) {
              <option [ngValue]="client">{{client.name}}</option>
            }
          </select>
        </div>

        <div class="mb-4">
          <label for="commentary" class="block text-dark-gray font-bold mb-2">Comentario (opcional):</label>
          <textarea id="commentary" [(ngModel)]="commentary" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" rows="3"></textarea>
        </div>

        <div class="mb-6">
          <label for="time" class="block text-dark-gray font-bold mb-2">Tiempo (HH:MM):</label>
          <input type="text" id="time" [(ngModel)]="time" placeholder="00:00" pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        </div>

        <div class="flex justify-between">
          <button class="button-base button-primary w-full sm:w-auto mr-2" (click)="saveEntry()">Empezar</button>
          <button class="button-base button-secondary w-full sm:w-auto" (click)="closeModal()">Cancelar</button>
        </div>
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
  @Output() save = new EventEmitter<{clientId: string, clientName: string, commentary: string, pricePerHour: number, elapsedTime: number, formattedTime: string, isRunning: boolean}>();

  selectedClient: Client | null = null;
  commentary = '';
  time = '00:00';

  convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  formatTime(input: string): string {
    const [hours, minutes] = input.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const formattedHours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const formattedMinutes = (totalMinutes % 60).toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
  }

  closeModal() {
    this.close.emit();
  }

  saveEntry() {
    if (this.selectedClient) {
      const formattedTime = this.formatTime(this.time);
      const elapsedTime = this.convertTimeToMinutes(formattedTime);
      this.save.emit({
        clientName: this.selectedClient.name,
        clientId: this.selectedClient.id,
        commentary: this.commentary,
        formattedTime: formattedTime,
        elapsedTime: elapsedTime,
        pricePerHour: this.selectedClient.pricePerHour,
        isRunning: true
      });
      this.closeModal();
    }
  }

}
