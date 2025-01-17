import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _snackBar = inject(MatSnackBar);

  showMessage(message: string) {
    this._snackBar.open(message, undefined, {
      duration: 3000,
    });
  }

  info(message: string, action?: string) {
    this._snackBar.open(message, action, {
      panelClass: ['info-theme'], // Optional class for styling
      duration: 3000,
    });
  }

  error(message: string, action?: string) {
    this._snackBar.open(message, action, {
      panelClass: ['error-theme'], // Optional class for styling
      duration: 3000
    });
  }

  success(message: string, action?: string) {
    this._snackBar.open(message, action, {
      panelClass: ['success-theme'], // Optional class for styling
      duration: 3000,
    });
  }

  warn(message: string, action?: string) {
    this._snackBar.open(message, action, {
      panelClass: ['warning-theme'], // Optional class for styling
      duration: 3000,
    });
  }
}
