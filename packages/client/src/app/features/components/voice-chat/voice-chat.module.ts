import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { MaterialUIModule } from '../../../core/modules/material.ui.module'
import { VoiceChatStatusComponent } from './voice-chat-status-icon/voice-chat-status-icon.component'
import { VoiceChatComponent } from './voice-chat/voice-chat.component'


@NgModule({
  declarations: [
    VoiceChatComponent,
    VoiceChatStatusComponent
  ],
  imports: [
    CommonModule,
    MaterialUIModule,
    RouterModule.forChild([])
  ],
  exports: [
    VoiceChatComponent,
    VoiceChatStatusComponent
  ]
})
export class VoiceChatModule { }
