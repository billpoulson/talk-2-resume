import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class TickService {
  isRunning = false;
  constructor() {

  }

  toggleClock() {
    this.isRunning = !this.isRunning
  }
}
