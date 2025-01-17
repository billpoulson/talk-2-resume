
import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core'
import { completeSubject, ConnectionState } from '@talk2resume/common'
import { combineLatest, map, Subject } from 'rxjs'
import { AppMessageQueue } from '../../../../core/mq/app-message-queue'
import { P2PStreamConnectionService } from '../services/p2p-stream-connection.service'

@Component({
  selector: 'app-voice-chat',
  standalone: false,
  templateUrl: './voice-chat.component.html',
  styleUrls: ['./voice-chat.component.scss'],
})
export class VoiceChatComponent implements OnInit, OnDestroy {
  @HostBinding('class') hostClass: string = 'error-theme';
  @Input() public autoConnect = false

  viewState$ = () => this.createViewState()

  p2pStream: P2PStreamConnectionService
  private dipose$ = new Subject<void>

  constructor(
    private mq: AppMessageQueue
  ) {
    this.p2pStream = new P2PStreamConnectionService(this.mq)
  }

  ngOnDestroy(): void {
    this.p2pStream.dispose()
    completeSubject(this.dipose$)
  }

  async ngOnInit() {
    await this.p2pStream.init()
    if (this.autoConnect) {
      await this.createOffer()
    }
  }

  async startLocalStream() {
    this.p2pStream.startLocalStream()
  }

  async createOffer() {
    this.p2pStream.createOffer()
  }

  async endCall() {
    this.p2pStream.endStream()
  }


  isConnected$ = () =>
    this.p2pStream.callStatus$
      .pipe(map(({ call }) => {
        return call === ConnectionState.Connected
      }))

  showConnectButton$ = () =>
    this.p2pStream.callStatus$
      .pipe(map(({ call }) => {
        return call === ConnectionState.Idle
      }))

  showDisconnectButton$ = () =>
    this.p2pStream.callStatus$.pipe(map(({ call }) => {
      return call === ConnectionState.Connected
    }))


  createViewState = () =>
    combineLatest([
      this.p2pStream.statusMessage$,
      this.p2pStream.callStatus$,
      this.isConnected$(),
      this.showConnectButton$(),
      this.showDisconnectButton$(),
    ]).pipe(
      map(([statusMessage, status, isConnected, showConnect, showDisconnect]
      ) => ({
        statusMessage,
        status,
        isConnected,
        showConnect,
        showDisconnect
      })))

}




