import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core'
import { map, Observable } from 'rxjs'
import { ChatServiceState, ClientChatService } from '../../../core/services/sockets/client-chat.service'
import { SocketConnectionStatus } from '../../../core/subjects/socket-connection-status'
import { createComponentBem } from '../../../core/util/bem'
import { ChannelListModalActivator } from './channel-list.modal/channel-list.modal.component'

const asd = <TModel, TVal>(source: Observable<TModel>) => ({
  select: (ƒ: (τ: TModel) => TVal): Observable<TVal> => source.pipe(map(ƒ))
})

@Component({
  selector: 'app-chat-panel',
  templateUrl: `chat-panel.component.html`,
  styleUrls: ['./chat-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ChatPanelComponent {
  bem = createComponentBem('app-chat-panel')
  cs$: Observable<ChatServiceState>
  channels$: Observable<string[]>
  @ViewChild(ChannelListModalActivator) channelListModal!: ChannelListModalActivator

  constructor(
    public chatService: ClientChatService,
    public socketConnectionStatus: SocketConnectionStatus,
  ) {
    this.cs$ = this.chatService.state$
    this.channels$ = this.chatService.state$.pipe(map(x => x.channels))
  
  }

  openChannelList() {
    this.channelListModal.activate()
  }

}
