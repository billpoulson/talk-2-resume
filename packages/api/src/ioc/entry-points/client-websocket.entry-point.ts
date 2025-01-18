import { injectable } from 'tsyringe'
import { ChatServerService } from '../../services/chat/chat-server-service'
import { UserSocketChat } from '../../services/chat/user-socket-chat'
import { UserSocketRAGChatPrompt } from '../../services/chat/user-socket-rag-chat-prompt'
import { P2PConnection } from '../../services/p2p/p2p-connection'
import { AuthorizationResponseEmitter } from '../../services/sockets/hub/emitters/authorization-response-emitter'
import { ServerTimeEmitter } from '../../services/sockets/hub/emitters/server-time-emitter'

@injectable()
export class ClientWebsocketEntryPoint {
    constructor(
        public authorizationResponseHandler: AuthorizationResponseEmitter,
        public commsService: ChatServerService,
        public UserSocketScopedCHAT: UserSocketChat,
        public p2p: P2PConnection,
        // public promptCompanion: UserSocketChatPrompt
        public ragService: UserSocketRAGChatPrompt,
        public time: ServerTimeEmitter
    ) { }
}
