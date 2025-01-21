import { DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MaterialUIModule } from '../../../core/modules/material.ui.module'
import { ModalModule } from '../modal/modal.module'
import { SelectFileNodeModalComponent, SelectFileNodeModalComponentActivator } from './components/select-file-node.modal/select-file-node.modal.component'
import { FileManagerComponent } from './file-manager.component'


@NgModule({
  declarations: [
    FileManagerComponent,
    SelectFileNodeModalComponent,
    SelectFileNodeModalComponentActivator,
  ],
  imports: [
    CommonModule,
    MaterialUIModule,
    DragDropModule,
    ModalModule
  ],
  exports: [FileManagerComponent],
  providers: [
    SelectFileNodeModalComponent,
    SelectFileNodeModalComponentActivator,
  ]
})
export class FileManagerModule { }
