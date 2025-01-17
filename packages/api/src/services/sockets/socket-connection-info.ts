import { completeSubject, newUUID } from '@talk2resume/common'
import { UserInfoObject } from '@talk2resume/types'
import { Subject, lastValueFrom } from 'rxjs'
import WebSocket from 'ws'


export class ClientWebsocketConnectionInstance {
  _websocketClose$ = new Subject<number>()

  static create = (
    profile: UserInfoObject,
    socket: WebSocket
  ) => new ClientWebsocketConnectionInstance(profile, socket, newUUID())

  events: {
    socketClosed$: Subject<number>,
    socketClosed: Promise<number>,
  }

  constructor(
    public profile: UserInfoObject,
    public socket: WebSocket,
    public connectionId: string
  ) {

    this.events = {
      socketClosed$: this._websocketClose$,
      socketClosed: lastValueFrom(this._websocketClose$)
    }

    socket.on('close', () => {
      completeSubject(this._websocketClose$)
    })

  }
}


