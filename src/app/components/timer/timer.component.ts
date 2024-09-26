import { Component, signal, OnDestroy, computed } from '@angular/core';
import { TimerFormComponent } from './timer-form/timer-form.component';
import { ClientService } from '../../services/client.service';
import { TimerService } from '../../services/timer.service';
import { Client, Timer } from '../../interfaces';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [TimerFormComponent],
  template: `
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <h2 class="text-2xl sm:text-3xl mb-4 sm:mb-6">Timers</h2>

      <button (click)="isOpen.set(true)" class="button-base button-secondary w-full sm:w-auto mb-4 sm:mb-6">Nuevo Timer</button>

      @if (isOpen()) {
        <app-timer-form (close)="isOpen.set(false)" (save)="saveTimer($event)" [clients]="clients"></app-timer-form>
      }

      @if (timers().length === 0) {
        <p class="text-lg">No timers found.</p>
      } @else {
        <ul class="space-y-3 sm:space-y-4">
          @for (timer of timers(); track timer.id) {
            <li class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg shadow bg-primary-darker border border-off-white">
              <span class="mb-2 sm:mb-0">{{ timer.clientName }} - {{ timer.formattedTime }}</span>
              <button (click)="toggleTimer(timer)" class="button-base button-secondary w-full sm:w-auto">
                {{ timer.isRunning ? 'Stop' : 'Resume' }}
              </button>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: ``
})
export class TimerComponent implements OnDestroy {
  clients: Client[] = [];
  timers = signal<Timer[]>([]);
  isOpen = signal(false);
  private timerSubscription: Subscription;

  constructor(private clientService: ClientService, private timerService: TimerService) {
    this.timerSubscription = interval(60000).subscribe(() => {
      this.updateRunningTimers();
    });
  }

  ngOnInit() {
    this.loadClients();
    this.loadTimers();
  }

  private async loadTimers() {
    try {
      const timers = await this.timerService.getTimersToday();
      this.timers.set(timers);
    } catch (error) {
      console.error('Error loading timers:', error);
    }
  }

  private loadClients() {
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
      }
    });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    // Save all timers to the database
    this.timers().forEach(timer => {
      if (timer.id !== undefined) {
        this.timerService.updateTimer(timer.id, { ...timer, isRunning: false })
        .catch(error => {
          console.error('Error updating timer:', error);
        })
      }
    });
  }

  async saveTimer(timerData: {clientId: string, clientName: string, commentary: string, pricePerHour: number, elapsedTime: number, formattedTime: string, isRunning: boolean}) {
    const newTimer: Timer = {
      clientName: timerData.clientName,
      clientId: timerData.clientId,
      commentary: timerData.commentary,
      elapsedTime: timerData.elapsedTime,
      formattedTime: timerData.formattedTime,
      isRunning: timerData.isRunning,
      pricePerHour: timerData.pricePerHour,
    };
    const savedTimer = await this.timerService.createTimer(newTimer);
    this.timers.update(timers => [...timers, savedTimer]);
    this.isOpen.set(false);
    this.updateTimerDisplay(newTimer);
  }

  toggleTimer(timer: Timer) {
    this.timers.update(timers => 
      timers.map(t => t === timer ? { ...t, isRunning: !t.isRunning } : t)
    );
    this.updateTimerDisplay(timer);
    if (timer.id !== undefined) {
      this.timerService.updateTimer(timer.id, { ...timer, isRunning: !timer.isRunning });
    }
  }

  private updateRunningTimers() {
    this.timers.update(timers => 
      timers.map(timer => {
        if (timer.isRunning) {
          timer.elapsedTime += 1;
          this.updateTimerDisplay(timer);
        }
        return timer;
      })
    );
  }

  private updateTimerDisplay(timer: Timer) {
    const hours = Math.floor(timer.elapsedTime / 60);
    const minutes = timer.elapsedTime % 60;
    timer.formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}
