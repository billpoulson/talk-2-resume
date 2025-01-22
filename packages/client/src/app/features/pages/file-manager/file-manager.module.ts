import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { UIModule } from '../../../core/modules/ui.module'
import { ModalModule } from '../../components/modal/modal.module'
import { FileManagerPageComponent } from './file-manager.component'


@NgModule({
  declarations: [
    FileManagerPageComponent,
  ],
  imports: [
    CommonModule,
    UIModule,
    ModalModule,
    RouterModule,
  ],
  providers: [
    FileManagerPageComponent,
  ]
})
export class FileManagerPageModule { }
