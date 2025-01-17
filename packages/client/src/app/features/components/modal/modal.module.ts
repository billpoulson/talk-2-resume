import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { MaterialUIModule } from '../../../core/modules/material.ui.module'
import { ExampleModalComponent } from './example.modal/example.modal.component'


const modals = [ExampleModalComponent]

@NgModule({
  declarations: modals,
  imports: [
    CommonModule,
    MaterialUIModule
  ],
  exports: modals
})
export class ModalModule { }
