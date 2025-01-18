import { MQ, newUUID, WebsocketService } from '@talk2resume/common'
import { ConnectionAuthorizationData, UserInfoObject } from '@talk2resume/types'
import { DependencyContainer } from 'tsyringe'
import WebSocket from 'ws'
import { OllamaRAGService } from '../../services/ai/ollama-rag.service'
import { UserSocketChat, } from '../../services/chat/user-socket-chat'
import { UserSocketChatPrompt } from '../../services/chat/user-socket-chat-prompt'
import { ClientWebsocketConnectionInstance } from '../../services/sockets/socket-connection-info'
import { ClientWebsocketEntryPoint } from '../entry-points/client-websocket.entry-point'
import { WSTOKEN_SEND_FN$$ } from '../injection-tokens'
import { registerUserRBACContainer } from '../modules/register-rbac-container'

export function createClientScope(
  parentScope: DependencyContainer,
  connection: ClientWebsocketConnectionInstance
) {
  const { connectionId, socket, profile } = connection

  const scope = parentScope
    .createChildContainer()
    .registerSingleton(MQ)
    .registerSingleton(ConnectionAuthorizationData)
    .registerSingleton(WebSocket)
    .registerSingleton(UserInfoObject)
    .registerSingleton(WebsocketService)
    .registerSingleton(UserSocketChat)
    .registerSingleton(UserSocketChatPrompt)
    .registerSingleton(ClientWebsocketEntryPoint)
    .registerSingleton(OllamaRAGService)
    .register(ClientWebsocketConnectionInstance, { useValue: connection })
    .register(ConnectionAuthorizationData, { useValue: { connectionId } })
    .register(WebSocket, { useValue: socket })
    .register(UserInfoObject, { useValue: profile })
    .register(WebsocketService, WebsocketService.createProvider(socket))
    .register(WSTOKEN_SEND_FN$$, {
      useValue: (message: any) => socket.send(JSON.stringify({
        ...message,
        ...{ uuid: newUUID() } // append a uuid to every message
      }))
    })
    
  registerUserRBACContainer(scope)

  return {
    scope,
    activate: () => { scope.resolve(ClientWebsocketEntryPoint) }
  }
}
