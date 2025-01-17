import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { UIModule } from '../../../core/modules/ui.module'
import { TextChatModule } from '../../components/text-chat/text-chat.module'
import { SandboxPageComponent } from './sandbox.component'

@NgModule({
  declarations: [
    SandboxPageComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    TextChatModule,
  ],
  providers: [
    SandboxPageComponent,
  ]
})
export class DashboardModule { }
