import { convertToKebabCase } from '@talk2resume/common'
import { ClientChatMessage, ClientChatMessageData, ClientChatMessageSenderFragment, PushChannelUsersMessage } from '@talk2resume/types'

import { ChatUserData } from '@talk2resume/types'
import { concatMap, filter, from, merge, Subject, tap } from 'rxjs'
import { singleton } from 'tsyringe'
import WebSocket from 'ws'

@singleton()
export class ChatServerService {

  channels = ['GLOBAL']

  stream = new Subject<ClientChatMessageData>
  clients = new Map<string, ChatUserData>()

  constructor() {
    merge(
      this.stream.pipe(
        concatMap((message) => from(this.clients.entries())
          .pipe(
            // filter(([, user]) => user.connectionId !== message.connectionId),
            filter(([, client]) => client.isSubscribedToMessage(message)),
            tap(([, client]) => {
              const { send, connectionId } = client
              message.isSender = connectionId == message.connectionId
              send({
                type: convertToKebabCase(ClientChatMessage.name),
                data: message
              })
            })
          )
        )))
      .subscribe()
  }

  register(
    connectionId: string,
    user: string,
    ws: WebSocket,
    sendJson: (message: any) => void
  ): ClientChatMessageSenderFragment {
    const joinChannels = ['GLOBAL']
    console.info(`${ChatServerService.name}: ${user}: connected`)

    const newClient = new ChatUserData(
      connectionId, user, ws, sendJson, joinChannels
    )
    this.clients.set(connectionId, newClient)
    this.pushChannelUsersUpdate(newClient)

    return { connectionId, user }
  }

  deregister(clientId: string) {
    const client = this.clients.get(clientId)!
    this.clients.delete(clientId)
    this.pushChannelUsersUpdate(client)
  }

  pushChannelUsersUpdate(initByUser: ChatUserData) {
    if (initByUser === undefined) { debugger }
    Array.from(this.clients.entries())
      .filter(([, user]) => {
        if (user === undefined) {
          debugger
        }
        return user.channelSubscriptions.some(sub => initByUser.channelSubscriptions.includes(sub))
      }
      ) // only users subscribed to the same channel as the initByUser
      .map(([key, user], _,) => /* build map of users in channels*/
        [user, user.channelSubscriptions
          .reduce((state, channel) => ({
            ...state,
            [channel]: Array
              .from(this.clients.entries())
              .filter(([, peer]) => peer.channelSubscriptions.includes(channel))
              .map(([, { user: username }]) => username)
          }), {})] as [ChatUserData, any])
      .forEach(([{ send }, data]) => {
        send({
          type: convertToKebabCase(PushChannelUsersMessage.name),
          data
        })
      })
  }

  updateUsername(connectionId: string, newName: string): ClientChatMessageSenderFragment {
    const client = this.clients.get(connectionId)!
    client.user = newName

    this.pushChannelUsersUpdate(client)
    return client
  }

  isUsernameInUse(checkName: string) {
    return Object.keys(this.channels.entries).includes(checkName)
  }
}

