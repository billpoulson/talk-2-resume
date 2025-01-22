import { Location } from '@angular/common'; // Ensure correct import
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { tap } from 'rxjs'
import { ModalActivator } from '../modal-activator.component'

export type AppSingleTextInputModalViewModel = {
  inputPlaceholder: string
  prompt: string
  explaination: string
  confirmButtonText: string,
  meta?: any
}
export type AppSingleTextInputEventData = {
  text: string
  cancel?: boolean
  meta?: any
}

@Component({
  selector: 'app-single-text-input.modal',
  standalone: false,
  templateUrl: './single-text-input.modal.component.html',
  styleUrl: './single-text-input.modal.component.scss'
})
export class SingleTextInputModalComponent {
  // @Output() folderName = new EventEmitter<string>()
  @Input() folderName = ''
  // folderName = ''
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AppSingleTextInputModalViewModel,
    private dialogRef: MatDialogRef<
      SingleTextInputModalComponent,
      AppSingleTextInputEventData
    >
  ) {
  }
}

@Component({
  selector: 'app-single-text-input-modal-activator',
  standalone: false,
  template: '',
  styles: ''
})
export class SingleTextInputModalActivator extends ModalActivator<AppSingleTextInputModalViewModel> {

  @Output() completed = new EventEmitter<AppSingleTextInputEventData>();
  @Input() view!: AppSingleTextInputModalViewModel

  constructor(
    location: Location,
    router: Router,
    route: ActivatedRoute,
    dialog: MatDialog
  ) {
    super(location, router, route, dialog)
  }
  activateWithMetaData(meta: any) {
    const dialogRef = this.launchDialog<
      SingleTextInputModalComponent,
      AppSingleTextInputModalViewModel,
      AppSingleTextInputEventData
    >(SingleTextInputModalComponent, {
      ...this.view, meta: {
        ...this.view.meta,
        ...meta
      }
    })
    dialogRef
      .afterClosed()
      .pipe(
        tap(result => {
          this.completed.emit(result)
        })
      ).subscribe()
  }

  override activate() {
    const dialogRef = this.launchDialog<
      SingleTextInputModalComponent,
      AppSingleTextInputModalViewModel,
      AppSingleTextInputEventData
    >(SingleTextInputModalComponent, {
      ...this.view
    })
    dialogRef
      .afterClosed()
      .pipe(
        tap(result => {
          this.completed.emit(result)
        })
      ).subscribe()
  }
}
