import { Injectable } from '@angular/core'
import { convertToKebabCase, MessageConstructor, MessageData } from '@talk2resume/common'
import { filter, map, Observable, tap } from 'rxjs'
import { AuthroizedWebSocketService } from '../services/sockets/authorized-web-socket.service'


@Injectable({
  providedIn: 'root'
})
export class AppMessageQueue {
  mq: Observable<any>

  constructor(
    private socket: AuthroizedWebSocketService,
  ) {
    this.mq = socket.messages.pipe(
      filter(this.isMQMessage)
    )
  }

  isMQMessage(payload: any): boolean {
    return 'type' in payload && 'data' in payload
  }

  select<TModel>(actionType: string): Observable<TModel> {
    return this.mq.pipe(
      filter(({ type }) => actionType === type)
    )
  }

  selectTypedMessage<TData>(
    MessageClass: MessageConstructor<TData, MessageData<TData>>
  ) {
    let rxCount = -1// number of messages received on this selector
    return this.mq.pipe(
      filter(({ type }) => type === convertToKebabCase(MessageClass.name)),
      tap(({ uuid }) => {
        console.log(`${rxCount++} : received message ${uuid} ${convertToKebabCase(MessageClass.name)}`)
      }),
      map(({ data }) => data as TData)
    )
  }

  createTypedMessageInterface
    <TData>(
      MessageClass: MessageConstructor<TData, MessageData<TData>>
    ): { send: (data: TData) => void } {
    return {
      send: (data: TData) => {
        this.socket.send(
          createWrappedMessage(MessageClass, data)
        )
      }
    }
  }


}


export function createWrappedMessage<TData>(
  MessageClass: MessageConstructor<TData, MessageData<TData>>,
  data: TData
): MessageData<TData> {
  const { name } = MessageClass
  return {
    ...new MessageClass(data),
    type: convertToKebabCase(name)
  } as MessageData<TData>
}