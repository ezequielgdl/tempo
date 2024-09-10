import { Injectable } from '@angular/core';
import { Timer } from '../interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientTimersService {
  private clientTimersSubject = new BehaviorSubject<Timer[]>([]);
  clientTimers$: Observable<Timer[]> = this.clientTimersSubject.asObservable();

  constructor() { }

  setClientTimers(timers: Timer[]) {
    this.clientTimersSubject.next(timers);
  }

  getClientTimers(): Timer[] {
    return this.clientTimersSubject.getValue();
  }

  clearClientTimers() {
    this.clientTimersSubject.next([]);
  }
}
