import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, input, OnInit, ViewChild } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { ClientChatService } from '../../../../core/services/sockets/client-chat.service'
import { SocketConnectionStatus } from '../../../../core/subjects/socket-connection-status'
import { createComponentBem } from '../../../../core/util/bem'

const channelusers = new BehaviorSubject<Array<string>>([])

@Component({
  selector: 'app-chat-channel',
  standalone: false,

  templateUrl: './chat-channel.component.html',
  styleUrl: './chat-channel.component.scss'
})
export class ChatChannelComponent implements OnInit, AfterViewChecked {
  bem = createComponentBem('app-chat-channel')
  @ViewChild('aaa', { static: false }) private aaa!: ElementRef
  readonly channel = input<string>('');
  channelusers: BehaviorSubject<string[]>
  constructor(
    public chatService: ClientChatService,
    public socketConnectionStatus: SocketConnectionStatus,
    private cdr: ChangeDetectorRef,
  ) {
    this.channelusers = channelusers
    this.chatService.messageReceived.subscribe(v => {
      this.aaa.nativeElement.scrollTop = this.aaa.nativeElement.scrollHeight

    })

  }
  ngAfterViewChecked() {
    this.aaa.nativeElement.scrollTop = this.aaa.nativeElement.scrollHeight
  }

  ngOnInit(): void {
    this.chatService.subscribeToChannelUsers(this.channel())
      .subscribe((users) => {
        channelusers.next(users)
        this.cdr.markForCheck()
      })

  }

  sendMessage(
    input: HTMLInputElement,
    channel: string,
    event: Event
  ) {
    if (input.value.trim()) {
      this.chatService.sendMessage(channel, input.value)
      input.value = ''
    }
  }
}
