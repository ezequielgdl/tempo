import { Component, OnDestroy } from '@angular/core';
import { TimerFormComponent } from './timer-form/timer-form.component';
import { Client } from '../interfaces';
import { interval, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

interface Timer {
  id: number;
  client: Client;
  commentary: string;
  elapsedTime: number;
  formattedTime: string;
  isRunning: boolean;
  subscription: Subscription | null;
  createdDate: Date;
  isEditing: boolean;
}

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
        <p>{{ timer.client.name }}</p>
        <p>{{ timer.createdDate | date:'EEEE, d \\\'de\\\' MMMM \\\'de\\\' y':'':'es' }}</p>
        @if (timer.commentary) {
          <p>{{ timer.commentary }}</p>
        }
        <div>{{ timer.formattedTime }}</div>
        @if (!timer.isEditing) {
          @if (timer.isRunning) {
            <button (click)="stopTimer(timer)">Stop Timer</button>
          } @else {
            <button (click)="startTimer(timer)">Start Timer</button>
          }
          <button (click)="editTimer(timer)">Edit Timer</button>
        }

        @if (timer.isEditing) {
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
export class TimerComponent implements OnDestroy {
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

  timers: Timer[] = [];
  private nextTimerId = 1;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveEntry(entry: {client: Client, commentary: string, time: string}) {
    this.closeModal();
    const [hours, minutes] = entry.time.split(':').map(Number);
    const elapsedTime = hours * 60 + minutes;
    const newTimer: Timer = {
      id: this.nextTimerId++,
      client: entry.client,
      commentary: entry.commentary,
      elapsedTime: elapsedTime,
      formattedTime: entry.time,
      isRunning: false,
      subscription: null,
      createdDate: new Date(),
      isEditing: false
    };
    this.timers.push(newTimer);
    this.startTimer(newTimer);
  }

  startTimer(timer: Timer) {
    timer.isRunning = true;
    timer.subscription = interval(60000).subscribe(() => {
      timer.elapsedTime++;
      this.updateFormattedTime(timer);
    });
  }

  stopTimer(timer: Timer) {
    if (timer.subscription) {
      timer.subscription.unsubscribe();
    }
    timer.isRunning = false;
  }

  updateFormattedTime(timer: Timer) {
    const hours = Math.floor(timer.elapsedTime / 60);
    const minutes = timer.elapsedTime % 60;
    timer.formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  editTimer(timer: Timer) {
    this.stopTimer(timer);
    timer.isEditing = true;
  }

  updateTimer(timer: Timer) {
    const [hours, minutes] = timer.formattedTime.split(':').map(Number);
    timer.elapsedTime = hours * 60 + minutes;
    this.updateFormattedTime(timer);
    timer.isEditing = false;
  }

  cancelEdit(timer: Timer) {
    timer.isEditing = false;
    this.updateFormattedTime(timer);
  }

  // TO DO: add a way to save the timers and upload to the backend server
  ngOnDestroy() {
    this.timers.forEach(timer => {
      if (timer.subscription) {
        timer.subscription.unsubscribe();
      }
    });
  }
}
