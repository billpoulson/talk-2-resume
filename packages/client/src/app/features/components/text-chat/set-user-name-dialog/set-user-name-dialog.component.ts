import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-set-user-name-dialog',
  standalone: false,

  templateUrl: './set-user-name-dialog.component.html',
  styleUrl: './set-user-name-dialog.component.scss'
})
export class SetUserNameDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string }) { }
  name = ''
}

// export function openSetUsernameDialog() {
//   const dialog = inject(MatDialog);
//   const dialogRef = dialog.open(SetUserNameDialogComponent, {
//     data: {},
//   });
// }
