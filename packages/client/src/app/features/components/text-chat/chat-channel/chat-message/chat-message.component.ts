import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { ClientChatMessageData } from '@talk2resume/types'
import { createComponentBem } from '../../../../../core/util/bem'

@Component({
  selector: 'app-chat-message',
  standalone: false,

  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent implements OnInit, OnChanges {
  bem = createComponentBem('app-chat-channel-message')

  @Input() data!: ClientChatMessageData
  aax!: SafeHtml
  constructor(
    private sanitizer: DomSanitizer
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.aax = this.sanitizer.bypassSecurityTrustHtml(this.data.message.replaceAll('\n', '</br>')
    .replaceAll('\r', '</br>'))
  }
  ngOnInit(): void {
  }


  getMessageContent(message: string) {
    message = message
      .replaceAll('\n', '</br>')
      .replaceAll('\r', '</br>')
    return this.sanitizer.bypassSecurityTrustHtml(message)
  }
  getMessageDate() {
    return new Date(this.data.timestamp).toLocaleString()
  }

  getStyles(bem: any) {
    const r = {
      ...bem,
      ['slide-in']: true,
      ['received-message']: !this.data.isSender,
      ['sent-message']: this.data.isSender,
    }
    return r
  }
}
