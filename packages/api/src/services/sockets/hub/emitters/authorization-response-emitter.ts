import { MQ } from '@talk2resume/common'
import { ConnectionAuthorizationData } from '@talk2resume/types'
import { injectable } from 'tsyringe'
import WebSocket from 'ws'
import { LoginsRepo } from '../../../../db/jsondb/login.repo'

import { HeroRepository } from '../../../../db/mongodb/repo/hero.repo'
import { OllamaRAGService } from '../../../ai/ollama-rag.service'
import { ClientWebsocketReference } from '../../../chat/client-web-socket-reference'


@injectable()
export class AuthorizationResponseEmitter {

  constructor(
    public authorization: ConnectionAuthorizationData,
    { send }: ClientWebsocketReference,
    ws: WebSocket,
    public mq: MQ,
    public repoImpl: LoginsRepo,
    heroRepo: HeroRepository,
    ragService: OllamaRAGService
  ) {
    ragService.loadSampleDocument()
    // Handle incoming messages
    ws.on('message', (message: WebSocket.RawData) => {
      try {
        console.log('socket message rcv....')
        const obj = JSON.parse(message.toString())
        mq.next(obj)
      } catch (ex: any) {
        send({
          type: 'mq-error',
          data: {
            ...ex,
            originalMessage: message
          }
        })
      }
    })
    // Handle connection close
    ws.on('close', () => { console.log('WebSocket connection closed.') })

    send(authorization)
    // repoImpl.incrementLoginCount(authorization.connectionId.toString())
  }
}
