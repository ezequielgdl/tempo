import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { interval, Subscription, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { TimerFormComponent } from './timer-form/timer-form.component';
import { ClientService } from '../../services/client.service';
import { TimerService } from '../../services/timer.service';
import { Client, Timer } from '../../interfaces';

registerLocaleData(localeEs);

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [TimerFormComponent, FormsModule, DatePipe, AsyncPipe],
  template: `
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <h1 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-dark-gray">Timer</h1>

      <button class="button-base button-primary w-full sm:w-auto mb-4 sm:mb-6" (click)="openModal()">+ Nuevo Timer</button>

      @if (showModal) {
        <app-timer-form
          [clients]="(clients$ | async) ?? []"
          (close)="closeModal()"
          (save)="saveEntry($event)"
        ></app-timer-form>
      }

      @for (timer of timers; track timer.id) {
        <div class="bg-off-white p-4 rounded-lg shadow-md mb-4">
          <p class="text-lg font-semibold text-dark-gray mb-2">{{ timer.clientName }}</p>

          @if (timer.commentary) {
            <p class="text-sm text-light-gray mb-2">{{ timer.commentary }}</p>
          }
          <div class="text-xl font-bold text-primary mb-3">{{ timer.formattedTime }}</div>
          @if (!this.isEditing) {
            <div class="flex flex-wrap gap-2">
              @if (timer.isRunning) {
                <button class="button-base button-secondary" (click)="stopTimer(timer)">Stop Timer</button>
              } @else {
                <button class="button-base button-primary" (click)="startTimer(timer)">Start Timer</button>
              }
              <button class="button-base button-primary" (click)="editTimer(timer)">Edit Timer</button>
              <button class="button-base button-secondary" (click)="deleteTimer(timer)">Delete Timer</button>
            </div>
          }

          @if (this.isEditing) {
            <div class="flex items-center gap-2 mt-2">
              <input [(ngModel)]="timer.formattedTime" placeholder="HH:MM" pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$" class="border rounded px-2 py-1">
              <button class="button-base button-primary" (click)="updateTimer(timer)">Update</button>
              <button class="button-base button-secondary" (click)="cancelEdit(timer)">Cancel</button>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: ``
})
export class TimerComponent implements OnInit, OnDestroy {
  showModal = false;
  isEditing = false;
  clients$: Observable<Client[]>;
  timers: Timer[] = [];
  private timerSubscription: Subscription | null = null;

  constructor(private clientService: ClientService, private timerService: TimerService) {
    this.clients$ = this.clientService.getClients();
  }

  ngOnInit() {
    this.loadData();
    this.startGlobalTimer();
  }

  async loadData() {
    try {
      this.timers = await this.timerService.getTimersToday();
    } catch (error) {
      console.error('Error loading timers:', error);
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
      pricePerHour: timerData.client.pricePerHour
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
