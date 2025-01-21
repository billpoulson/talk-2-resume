import { Location } from '@angular/common'; // Ensure correct import
import { Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { AppFlatTreeNode } from '@talk2resume/types'
import { tap } from 'rxjs'
import { ModalActivator } from '../../../modal/modal-activator.component'
import { FileManagerComponent } from '../../file-manager.component'

export type SelectFileNodeModalData = {
  prompt: string
  explaination: string
  confirmButtonText: string
  nodeToMove?: string
  sourceFolder?: string
}
export type FileNodeSelectedEventData = {
  nodeToMove: string
  sourceFolder?: string
  newFolder?: string
  cancel?: boolean
}
const EMPTY_RESULT: FileNodeSelectedEventData = { nodeToMove: '', cancel: true, newFolder: undefined }

@Component({
  selector: 'app-select-file-node.modal',
  standalone: false,
  templateUrl: './select-file-node.modal.component.html',
  styleUrl: './select-file-node.modal.component.scss'
})
export class SelectFileNodeModalComponent {
  @ViewChild(FileManagerComponent) fileManager!: FileManagerComponent
  @Input() selectedNode: AppFlatTreeNode | undefined
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SelectFileNodeModalData,
    private dialogRef: MatDialogRef<
      SelectFileNodeModalComponent,
      FileNodeSelectedEventData
    >
  ) { }

  completeFileSelection() {
    this.dialogRef.close({
      nodeToMove: this.data.nodeToMove!,
      newFolder: this.selectedNode?._id,
      sourceFolder: this.data.sourceFolder,
    })
  }
}

@Component({
  selector: 'app-select-file-node-modal-activator',
  standalone: false,
  template: '',
  styles: ''
})
export class SelectFileNodeModalComponentActivator extends ModalActivator<SelectFileNodeModalData> {

  @Output() complete = new EventEmitter<FileNodeSelectedEventData>();
  @Input() view!: SelectFileNodeModalData

  constructor(
    location: Location,
    router: Router,
    route: ActivatedRoute,
    dialog: MatDialog
  ) {
    super(location, router, route, dialog)
  }

  override activate(
    data?: Partial<SelectFileNodeModalData>,
    configOverrides?: Partial<MatDialogConfig<SelectFileNodeModalData>>
  ) {
    const dialogRef = this.launchDialog<
      SelectFileNodeModalComponent,
      SelectFileNodeModalData,
      FileNodeSelectedEventData
    >(SelectFileNodeModalComponent, { ...this.view, ...data })
    dialogRef
      .afterClosed()
      .pipe(
        tap(result => {
          this.complete.emit(result ?? EMPTY_RESULT)
        })
      ).subscribe()
  }
}
