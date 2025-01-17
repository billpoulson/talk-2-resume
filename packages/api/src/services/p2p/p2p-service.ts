import { P2PServiceMessageWrapper, WebRTC_ICE_Request, WebRTCConnectionAnswer, WebRTCConnectionOffer } from '@talk2resume/types'

import { forwardTo } from '@talk2resume/common'
import { concatMap, filter, finalize, from, map, merge, Subject, takeUntil, tap } from 'rxjs'
import { singleton } from 'tsyringe'
import { FromConnection } from '../sockets/from-connection'
import { SocketServiceConnection } from '../sockets/socket-service-connection'

type ServiceMessages = WebRTCConnectionOffer | WebRTC_ICE_Request | WebRTCConnectionAnswer

@singleton()
export class P2PService {
  stream = new Subject<ServiceMessages & FromConnection>
  clients = new Map<string, SocketServiceConnection>()

  constructor() {
    merge(
      this.routeP2PMessage$()
    ).subscribe()
  }

  private routeP2PMessage$() {
    return this.stream.pipe(
      concatMap((message) => from(this.clients.entries())
        .pipe(
          filter(([_, user]) => user.connectionId !== message.sourceConnectionId),
          tap(([_, { send }]) => { send(message) })
        )
      ))
  }

  connect(
    client: SocketServiceConnection
  ) {
    const { connectionId, peerMQ, disconnectSignal$ } = client
    console.info(`${SocketServiceConnection.name}: ${connectionId}: connected`)
    this.clients.set(connectionId, client)

    peerMQ.selectTypedMessage(P2PServiceMessageWrapper)
      .pipe(
        takeUntil(disconnectSignal$),
        map(message => ({
          ...message,
          sourceConnectionId: connectionId, // append the client id
        })),
        forwardTo(this.stream),
        finalize(() => {
          this.clients.delete(connectionId)
        })
      )
      .subscribe()

  }

  disconnect(name: string) {
    this.clients.get(name)?.disconnect()
  }

}
