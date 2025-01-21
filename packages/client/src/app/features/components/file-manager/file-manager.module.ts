import { DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MaterialUIModule } from '../../../core/modules/material.ui.module'
import { ModalModule } from '../modal/modal.module'
import { FileManagerComponent } from './file-manager.component'


@NgModule({
  declarations: [
    FileManagerComponent
  ],
  imports: [
    CommonModule,
    MaterialUIModule,
    DragDropModule,
    ModalModule
  ],
  exports: [FileManagerComponent]
})
export class FileManagerModule { }
