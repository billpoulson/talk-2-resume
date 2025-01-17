import { Injectable } from '@angular/core'
import { unixTimestamp } from '@talk2resume/common'
import { ChannelsAnnounceMessage, ClientChatMessage, ClientChatMessageData, PushChannelUsersMessage, SetUsernameError, SetUsernameSuccess } from '@talk2resume/types'
import { BehaviorSubject, filter, firstValueFrom, map, merge, startWith, Subject, tap } from 'rxjs'
import { AppMessageQueue } from '../../mq/app-message-queue'
import { NotificationService } from '../_/notification.service'

export type TypeMessagePipelineInterface<TData> = {
  send: (data: TData) => void
}
export type ChatServiceState = {
  channels: Array<string>
}
const SENDER = '$$SENDER$$'
@Injectable({
  providedIn: 'root',
})
export class ClientChatService {
  public messageReceived = new Subject();
  clientChatMessage: TypeMessagePipelineInterface<ClientChatMessageData>

  private _state$ = new BehaviorSubject<ChatServiceState>({
    channels: ['GLOBAL']
  })
  state$ = this._state$.asObservable()

  private messageLog: Array<ClientChatMessageData> = []
  channelUsersCache: Map<any, any>

  constructor(
    private appMq: AppMessageQueue,
    private notifyOf: NotificationService
  ) {
    this.channelUsersCache = new Map<string, Array<string>>
    this.clientChatMessage = this.appMq.createTypedMessageInterface(ClientChatMessage)

    merge(
      appMq.selectTypedMessage(ClientChatMessage)
        .pipe(tap(data => {
          this.messageLog.push(data)
          this.messageReceived.next(data)
        })),

      appMq.selectTypedMessage(ChannelsAnnounceMessage)
        .pipe(tap(({ channels }) => {
          this._state$.next({
            ...this._state$.value,
            channels
          })
          this.messageReceived.next(NaN)
        })),


      appMq.selectTypedMessage(SetUsernameError)
        .pipe(tap(data => {
          this.notifyOf.error(data.message)
        })),

      appMq.selectTypedMessage(SetUsernameSuccess)
        .pipe(tap(data => {
          this.notifyOf.success(data.message)
        }))
    ).subscribe()
  }

  sendMessage(channel: string, message: string) {
    this.clientChatMessage
      .send({
        channel,
        user: SENDER,
        connectionId: SENDER,
        isSender: false,
        message,
        ...unixTimestamp()
      })
  }

  getChannelMessages(channel: string, last = 10) {
    return this.messageLog
      .filter(t => t.channel === channel)
      .slice(-1 * last)
  }
  subscribeToChannelUsers(
    channel: string
  ) {
    return this.appMq.selectTypedMessage(PushChannelUsersMessage)
      .pipe(
        filter((data) => channel in data),
        map((data) => data[channel]),
        tap(newData => { this.channelUsersCache.set(channel, newData) }),
        startWith(this.channelUsersCache.get(channel))
      )
  }

  SUNS() {
    return firstValueFrom(this.appMq.select<{ data: { message: string } }>('set-user-name/success'))
  }
}
export type ChannelUsersData = {
  data: {
    [key: string]: Array<string>
  }
}
