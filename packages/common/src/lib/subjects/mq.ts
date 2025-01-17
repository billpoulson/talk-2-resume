import { filter, map, Observable, Subject, tap } from 'rxjs'
import { injectable } from 'tsyringe'
import { MessageConstructor, MessageData, WebsocketService } from '../mesh'
import { convertToKebabCase } from '../utils'
import { newUUID } from '../uuid'

@injectable()
export class MQ extends Subject<{ type: string, uuid: string, data: any }> {
  mquuid = newUUID()
  override next(value: { type: string; uuid: string; data: any }): void {
    super.next(value)
  }

  constructor(
    private aa: WebsocketService
  ) {
    super()
  }

  isMQMessage(payload: any): boolean {
    return 'type' in payload && 'data' in payload
  }

  selectTypedMessage<TData>(
    MessageClass: MessageConstructor<TData, MessageData<TData>>,
  ): Observable<TData> {
    const usage = newUUID()

    let rxCount = -1// number of messages received on this selector
    return this.pipe(
      filter(({ type }) => type === convertToKebabCase(MessageClass.name)),
      tap(({ uuid }) => {
        console.log(`${this.mquuid}/${usage}/${convertToKebabCase(MessageClass.name)}/${uuid} `)
      }),
      map(({ data }) => data as TData)
    )
  }

  selectInnerMessage<TData extends { type: string, uuid: string, data: TNested }, TNested>(
    aa: Observable<any>,
    MessageClass: MessageConstructor<TNested, MessageData<TNested>>
  ): Observable<TNested> {
    let rxCount = -1// number of messages received on this selector
    return aa.pipe(
      filter(({ type }) => type === convertToKebabCase(MessageClass.name)),
      tap(({ uuid }) => {
        console.log(`${rxCount++} : received inner message ${uuid} ${convertToKebabCase(MessageClass.name)}`)
      }),
      map(({ data }) => data as TNested)
    )
  }

  createTypedMessageInterface
    <TData>(
      MessageClass: MessageConstructor<TData, MessageData<TData>>
    ) {
    return {
      send: (data: TData) => {
        this.aa.sendMessage(
          this.createMessage(MessageClass, data)
        )
      }
    }
  }
  // createTypedMessageInterfacexx
  //   <TData>(
  //     o: Observable<TData>,
  //     MessageClass: MessageConstructor<TData, MessageData<TData>>
  //   ) {
  //   return {
  //     send: (data: TData) => {
  //       this.aa.sendMessage(
  //         this.createMessage(MessageClass, data)
  //       )
  //     }
  //   }
  // }
  createMessage<TData>(
    MessageClass: MessageConstructor<TData, MessageData<TData>>,
    data: TData
  ): MessageData<TData> {
    const { name } = MessageClass
    return {
      ...new MessageClass(data),
      type: convertToKebabCase(name)
    } as MessageData<TData>
  }

}

