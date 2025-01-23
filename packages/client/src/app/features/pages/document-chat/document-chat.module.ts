import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { UIModule } from '../../../core/modules/ui.module'
import { ModalModule } from '../../components/modal/modal.module'
import { DocumentChatComponent } from './document-chat.component'


@NgModule({
  declarations: [
    DocumentChatComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    ModalModule,
  ]
})
export class DocumentChatPageModule { }
