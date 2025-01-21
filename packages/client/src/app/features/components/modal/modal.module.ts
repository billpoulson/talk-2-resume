import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MaterialUIModule } from '../../../core/modules/material.ui.module'
import { SharedUIComponentsModule } from '../shared/shared.ui.module'
import { ExampleModalActivator, ExampleModalComponent } from './example.modal/example.modal.component'
import { UploadFilesModalComponent, UploadFilesModalComponentActivator } from './upload-files.modal/upload-files.modal.component'


const modals = [
  ExampleModalComponent,
  ExampleModalActivator,
  UploadFilesModalComponent,
  UploadFilesModalComponentActivator]

@NgModule({
  declarations: modals,
  imports: [
    CommonModule,
    MaterialUIModule,
    SharedUIComponentsModule,
  ],
  exports: modals
})
export class ModalModule { }
