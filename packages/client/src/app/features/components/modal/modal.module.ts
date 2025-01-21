import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MaterialUIModule } from '../../../core/modules/material.ui.module'
import { SharedUIComponentsModule } from '../shared/shared.ui.module'
import { ExampleModalActivator, ExampleModalComponent } from './example.modal/example.modal.component'
import { SingleTextInputModalActivator, SingleTextInputModalComponent } from './single-text-input.modal/single-text-input.modal.component'
import { UploadFilesModalComponent, UploadFilesModalComponentActivator } from './upload-files.modal/upload-files.modal.component'


const modals = [
  ExampleModalComponent,
  ExampleModalActivator,
  UploadFilesModalComponent,
  UploadFilesModalComponentActivator,
  SingleTextInputModalActivator,
  SingleTextInputModalComponent,

]

@NgModule({
  declarations: modals,
  imports: [
    CommonModule,
    FormsModule,
    MaterialUIModule,
    SharedUIComponentsModule,
  ],
  exports: modals
})
export class ModalModule { }
