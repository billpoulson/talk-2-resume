// import { Observable, Subject, filter, map } from 'rxjs'
// import { convertToKebabCase } from '../utils'
// import { MessageConstructor } from './message-constructor.type'
// import { MessageData } from './message-data.interface'

// export class AppMessageQueueSubject {
//   mq: Observable<any>

//   constructor(
//     private socket: any
//   ) {
//     this.mq = socket.messages.pipe(
//       filter(this.isMQMessage)
//     )
//   }

//   isMQMessage(payload: any): boolean {
//     return 'type' in payload && 'data' in payload
//   }

//   select<TModel>(actionType: string): Observable<TModel> {
//     return this.mq.pipe(
//       filter(({ type }) => actionType === type)
//     )
//   }

//   selectTypedMessage<TData>(
//     MessageClass: MessageConstructor<TData, MessageData<TData>>
//   ) {
//     return this.mq.pipe(
//       filter(({ type }) => type === convertToKebabCase(MessageClass.type)),
//       map(({ data }) => { return data as TData })
//     )
//   }
//   selectTypedMessage2<TData>(
//     MessageClass: MessageConstructor<TData, MessageData<TData>>
//   ) {
//     return this.mq.pipe(
//       filter(({ type }) => type === convertToKebabCase(MessageClass.type)),
//       map(({ type, data }) => { return { type, data } as { type: string, data: TData } })
//     ) as Observable<{ type: string, data: TData }>
//   }

//   createTypedMessageInterface<TData>(
//     MessageClass: MessageConstructor<TData, MessageData<TData>>
//   ) {
//     return {
//       send: (data: TData) => {
//         this.socket.send(
//           this.createMessage(MessageClass, data)
//         )
//       }
//     }
//   }

//   createMessage<TData>(
//     MessageClass: MessageConstructor<TData, MessageData<TData>>,
//     data: TData
//   ): MessageData<TData> {
//     const { name } = MessageClass
//     return {
//       ...new MessageClass(data),
//       type: convertToKebabCase(name)
//     } as MessageData<TData>
//   }

// }


// export class AppMessageQueue {
//   mq: Observable<any>

//   constructor(
//     private receive: Observable<any>,
//     private send: Subject<any>,
//   ) {
//     this.mq = receive.pipe(filter(this.isMQMessage))
//   }

//   isMQMessage(payload: any): boolean {
//     return 'type' in payload && 'data' in payload
//   }

//   select<TModel>(actionType: string): Observable<TModel> {
//     return this.mq.pipe(
//       filter(({ type }) => actionType === type)
//     )
//   }

//   selectTypedMessage<TData>(
//     MessageClass: MessageConstructor<TData, MessageData<TData>>
//   ) {
//     return this.mq.pipe(
//       filter(({ type }) => type === convertToKebabCase(MessageClass.type)),
//       map(({ data }) => { return data as TData })
//     )
//   }
//   selectTypedMessage2<TData>(
//     MessageClass: MessageConstructor<TData, MessageData<TData>>
//   ) {
//     return this.mq.pipe(
//       filter(({ type }) => type === convertToKebabCase(MessageClass.type)),
//       map(({ type, data }) => { return { type, data } as { type: string, data: TData } })
//     ) as Observable<{ type: string, data: TData }>
//   }

//   createTypedMessageInterface<TData>(
//     MessageClass: MessageConstructor<TData, MessageData<TData>>
//   ) {
//     return {
//       send: (data: TData) => {
//         this.send.next(
//           this.createMessage(MessageClass, data)
//         )
//       }
//     }
//   }

//   createMessage<TData>(
//     MessageClass: MessageConstructor<TData, MessageData<TData>>,
//     data: TData
//   ): MessageData<TData> {
//     const { name } = MessageClass
//     return {
//       ...new MessageClass(data),
//       type: convertToKebabCase(name)
//     } as MessageData<TData>
//   }

// }

export default 'test'