import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { MaterialUIModule } from '../../../core/modules/material.ui.module'
import { SharedUIComponentsModule } from '../shared/shared.ui.module'
import { ChannelListItemComponent } from './channel-list.modal/channel-list-item/channel-list-item.component'
import { ChannelListModalActivator, ChannelListModalComponent } from './channel-list.modal/channel-list.modal.component'
import { ChatChannelComponent } from './chat-channel/chat-channel.component'
import { ChatMessageComponent } from './chat-channel/chat-message/chat-message.component'
import { ChatPanelComponent } from './chat-panel.component'
import { NotConnectedComponent } from './not-connected/not-connected.component'
import { SetUserNameDialogComponent } from './set-user-name-dialog/set-user-name-dialog.component'

const components = [
  NotConnectedComponent,
  ChatPanelComponent,
  ChatChannelComponent,
  SetUserNameDialogComponent,
  ChannelListModalComponent,
  ChannelListItemComponent,
  ChannelListModalActivator,
  ChatMessageComponent
]

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MaterialUIModule,
    SharedUIComponentsModule,
    RouterModule.forChild([
      {
        path: 'channel-list',
        component: ChannelListModalActivator,
        outlet: 'modal', // Auxiliary route for the modal
        resolve: {
          data: () => ({}),
          config: () => ({ width: '800px' })
        },
      },
    ])
  ],
  declarations: components,
  exports: components
})
export class TextChatModule { }

