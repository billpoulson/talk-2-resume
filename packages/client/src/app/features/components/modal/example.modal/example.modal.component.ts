import { Location } from '@angular/common'; // Ensure correct import
import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ModalActivator } from '../modal-activator.component'

@Component({
  selector: 'app-example.modal',
  standalone: false,
  templateUrl: './example.modal.component.html',
  styleUrl: './example.modal.component.scss'
})
export class ExampleModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ExampleModalComponent>
  ) {
  }
}
@Component({
  selector: 'app-example-modal-loader',
  standalone: false,
  template: '',
  styles: ''
})
export class ExampleModalActivator extends ModalActivator<{}> {
  constructor(location: Location, router: Router, route: ActivatedRoute, dialog: MatDialog) {
    super(location, router, route, dialog)
  }
  override activate() {
    this.launchDialog(ExampleModalComponent)
  }
}
