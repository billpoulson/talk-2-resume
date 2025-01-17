import { Injectable } from '@angular/core';
import { filter, interval, tap } from 'rxjs';
import { ClockSignal } from '../../subjects/clock-signal';

@Injectable({
  providedIn: 'root'
})
export class TickService {
  isRunning = false;
  constructor(private signal: ClockSignal) {

    interval(10)
      .pipe(
        filter(_ => this.isRunning),
        tap(x => {
          this.signal.next(x);
        })).subscribe()

  }

  toggleClock() {
    this.isRunning = !this.isRunning
  }
}
