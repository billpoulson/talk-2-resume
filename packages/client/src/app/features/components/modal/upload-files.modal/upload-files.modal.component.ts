import { Location } from '@angular/common'; // Ensure correct import
import { Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { tap } from 'rxjs'
import { FileUploadComponent } from '../../shared/file-upload/file-upload.component'
import { ModalActivator } from '../modal-activator.component'

export type FileUploadModalViewModel = {
  prompt: string
  explaination: string
  confirmButtonText: string
}
export type FilesSelectedEventData = {
  selected: File[]
  cancel?: boolean
}
const EMPTY_RESULT: FilesSelectedEventData = { selected: [], cancel: true }

@Component({
  selector: 'app-upload-files.modal',
  standalone: false,
  templateUrl: './upload-files.modal.component.html',
  styleUrl: './upload-files.modal.component.scss'
})
export class UploadFilesModalComponent {
  @ViewChild(FileUploadComponent) fileUpload!: FileUploadComponent
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FileUploadModalViewModel,
    private dialogRef: MatDialogRef<
      UploadFilesModalComponent,
      FilesSelectedEventData
    >
  ) {
  }

  completeFileSelection() {
    const dialogResult = { selected: this.fileUpload.getSelectedFiles() }
    this.dialogRef.close(dialogResult)
  }
}

@Component({
  selector: 'app-upload-modal-activator',
  standalone: false,
  template: '',
  styles: ''
})
export class UploadFilesModalComponentActivator extends ModalActivator<FileUploadModalViewModel> {
  @Output() filesSelected = new EventEmitter<FilesSelectedEventData>();
  @Input() vvv!: FileUploadModalViewModel

  constructor(
    location: Location,
    router: Router,
    route: ActivatedRoute,
    dialog: MatDialog
  ) {
    super(location, router, route, dialog)
  }

  override activate() {
    const dialogRef = this.launchDialog<
      UploadFilesModalComponent,
      FileUploadModalViewModel,
      FilesSelectedEventData
    >(UploadFilesModalComponent, this.vvv)
    dialogRef
      .afterClosed()
      .pipe(
        tap(result => {
          this.filesSelected.emit(result ?? EMPTY_RESULT)
        })
      ).subscribe()
  }
}
