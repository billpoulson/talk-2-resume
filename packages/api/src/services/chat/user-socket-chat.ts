import { MQ, unixTimestamp } from '@talk2resume/common'
import { ClientChatMessage, ConnectionAuthorizationData, SetUsernameError, SetUsernameMessage, SetUsernameSuccess, UserInfoObject } from '@talk2resume/types'
import { merge, tap } from 'rxjs'
import { injectable } from 'tsyringe'
import WebSocket from 'ws'
import { ChatServerService } from './chat-server-service'
import { ClientWebsocketReference } from './client-web-socket-reference'


@injectable()
export class UserSocketChat {
  history: { role: string; content: string }[] = []

  constructor(
    commsService: ChatServerService,
    public authInfo: ConnectionAuthorizationData,
    public userInfo: UserInfoObject,
    public socket: WebSocket,
    { send }: ClientWebsocketReference,
    mq: MQ,
  ) {
    const referToUserAs = [userInfo.given_name, userInfo.nickname, 'Unknown'].filter(x => x != null)[0]
    let senderFragment = commsService.register(authInfo.connectionId, referToUserAs, socket, send)
    socket.on('close', () => { commsService.deregister(`${authInfo.connectionId}`) })
    merge(
      // set the current users preferred name
      mq.selectTypedMessage(SetUsernameMessage)
        .pipe(tap((data) => {
          if (commsService.isUsernameInUse(data)) {
            mq.createTypedMessageInterface(SetUsernameError)
              .send({ message: `"${data}" is already in use` })
            console.log('name in use')
          } else {
            senderFragment = commsService.updateUsername(authInfo.connectionId, data)
            mq.createTypedMessageInterface(SetUsernameSuccess)
              .send({ message: `name updated` })
            console.log('name updated')
          }
        })),

      // transfer message from user scope into shared chat service scope
      mq.selectTypedMessage(ClientChatMessage)
        .pipe(tap((data) => {
          commsService.stream.next({
            ...data,
            ...senderFragment,
            ...unixTimestamp()
          })
        }))
    ).subscribe()


  }

}
