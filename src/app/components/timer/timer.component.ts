import { Component, OnDestroy, OnInit } from '@angular/core';
import { TimerFormComponent } from './timer-form/timer-form.component';
import { Client } from '../../interfaces';
import { interval, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { ClientService } from '../../services/client.service';
import { TimerService } from '../../services/timer.service';
import { Timer } from '../../interfaces';

registerLocaleData(localeEs);

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [TimerFormComponent, FormsModule, DatePipe],
  template: `
    <button (click)="openModal()">+</button>

    @if (showModal) {
      <app-timer-form
        [clients]="clients"
        (close)="closeModal()"
        (save)="saveEntry($event)"
      ></app-timer-form>
    }

    @for (timer of timers; track timer.id) {
      <div>
        <p>{{ timer.clientName }}</p>

        @if (timer.commentary) {
          <p>{{ timer.commentary }}</p>
        }
        <div>{{ timer.formattedTime }}</div>
        @if (!this.isEditing) {
          @if (timer.isRunning) {
            <button (click)="stopTimer(timer)">Stop Timer</button>
          } @else {
            <button (click)="startTimer(timer)">Start Timer</button>
          }
          <button (click)="editTimer(timer)">Edit Timer</button>
          <button (click)="deleteTimer(timer)">Delete Timer</button>
        }

        @if (this.isEditing) {
          <div>
            <input [(ngModel)]="timer.formattedTime" placeholder="HH:MM" pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$">
            <button (click)="updateTimer(timer)">Update</button>
            <button (click)="cancelEdit(timer)">Cancel</button>
          </div>
        }
      </div>
    }
  `,
  styles: ``
})
export class TimerComponent implements OnInit, OnDestroy {
  showModal = false;
  isEditing = false;
  clients: Client[] = [];
  timers: Timer[] = [];
  private timerSubscription: Subscription | null = null;
  private clientsSubscription: Subscription | null = null;

  constructor(private clientService: ClientService, private timerService: TimerService) {}

  ngOnInit() {
    this.loadData();
    this.startGlobalTimer();
  }

  async loadData() {
    try {
      this.clientsSubscription = this.clientService.getClients().subscribe({
        next: (clients) => {
          this.clients = clients;
        },
        error: (error) => {
          console.error('Error loading clients:', error);
        }
      });
      this.timers = await this.timerService.getTimersToday();
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  async saveEntry(timerData: {client: Client, commentary: string, time: string}) {
    this.closeModal();
    const [hours, minutes] = timerData.time.split(':').map(Number);
    const elapsedTime = hours * 60 + minutes;
    const newTimer: Omit<Timer, 'id' | 'user_id'> = {
      clientId: timerData.client.id,
      clientName: timerData.client.name,
      commentary: timerData.commentary,
      elapsedTime: elapsedTime,
      formattedTime: timerData.time,
      isRunning: true,
    };
    try {
      const createdTimer = await this.timerService.createTimer(newTimer);
      this.timers.push(createdTimer);
    } catch (error) {
      console.error('Error creating timer:', error);
    }
  }

  startGlobalTimer() {
    this.timerSubscription = interval(60000).subscribe(() => {
      this.timers.forEach(timer => {
        if (timer.isRunning) {
          timer.elapsedTime++;
          this.updateFormattedTime(timer);
        }
      });
    });
  }

  startTimer(timer: Timer) {
    timer.isRunning = true;
  }

  async stopTimer(timer: Timer) {
    timer.isRunning = false;
    this.updateFormattedTime(timer);
    if (timer.id) {
      try {
        await this.timerService.updateTimer(timer.id, {
          isRunning: false,
          elapsedTime: timer.elapsedTime,
          formattedTime: timer.formattedTime
        });
      } catch (error) {
        console.error('Error updating timer in database:', error);
      }
    }
  }

  updateFormattedTime(timer: Timer) {
    const hours = Math.floor(timer.elapsedTime / 60);
    const minutes = timer.elapsedTime % 60;
    timer.formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  editTimer(timer: Timer) {
    this.stopTimer(timer);
    this.isEditing = true;
  }

  async updateTimer(timer: Timer) {
    const [hours, minutes] = timer.formattedTime.split(':').map(Number);
    timer.elapsedTime = hours * 60 + minutes;
    this.updateFormattedTime(timer);
    this.isEditing = false;

    if (timer.id) {
      try {
        await this.timerService.updateTimer(timer.id, {
          elapsedTime: timer.elapsedTime,
          formattedTime: timer.formattedTime
        });
      } catch (error) {
        console.error('Error updating timer in database:', error);
      }
    }
  }

  cancelEdit(timer: Timer) {
    this.isEditing = false;
    this.updateFormattedTime(timer);
  }

  async deleteTimer(timer: Timer) {
    if (timer.id) {
      try {
        await this.timerService.deleteTimer(timer.id);
        const index = this.timers.findIndex(t => t.id === timer.id);
        if (index !== -1) {
          this.timers.splice(index, 1);
        }
      } catch (error) {
        console.error('Error deleting timer:', error);
      }
    }
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
  }
}
