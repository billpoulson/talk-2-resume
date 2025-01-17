import { Injectable } from '@angular/core'
import { AuthService } from '@auth0/auth0-angular'
import { forwardTo } from '@talk2resume/common'
import { BehaviorSubject, catchError, concatMap, EMPTY, first, firstValueFrom, from, iif, interval, map, Observable, of, Subject, tap, timeout, zip } from 'rxjs'
import { SocketConnectionStatus } from '../../subjects/socket-connection-status'
import { NotificationService } from '../_/notification.service'
import { WebsocketService } from './web-socket.service'

const wssAuthorizeUri = (token: string) => `/wss/authorize/${token}`

@Injectable({
  providedIn: 'root'
})
export class AuthroizedWebSocketService {
  messages = new Subject<any>()
  clientMessageId = 0

  connectionStatus$ = new BehaviorSubject<boolean>(false)
  reconnectCountdown$ = new BehaviorSubject<number>(0)

  firstConnection = false;
  isAutoReconnecting = false;
  manualDisconnect = false;

  constructor(
    private websocketService: WebsocketService,
    public authService: AuthService,
    private notifyOf: NotificationService,
    socketConnectionStatus: SocketConnectionStatus,
  ) {
    this.connectionStatus$.pipe(forwardTo(socketConnectionStatus)).subscribe()
  }
  countdownFrom$(source: BehaviorSubject<number>, from: number) {
    source.next(from)
    return zip([interval(1000), source])
      .pipe(
        map(([, seconds]) => seconds - 1),
        forwardTo(source),
        first(v => v === 0)
      )
  }
  autoReconnect(username) {

    this.isAutoReconnecting = true
    const retries = 5


    this.recursiveTryConnection(username, retries)
      .subscribe(({ reconnected }) => {
        if (reconnected) {
          this.notifyOf.success('Socket Reconnected', 'OK')
        }
        else {
          this.notifyOf.error(`unable to connect after ${retries} attempts`, 'OK')
        }
      })
  }

  recursiveTryConnection(username: string, retries: number): Observable<{ reconnected: boolean }> {
    if (retries == 0) {
      return EMPTY
    }
    else {
      return this.countdownFrom$(this.reconnectCountdown$, 5)
        .pipe(
          concatMap(_ => this.connectionStatus$),
          concatMap((connected) =>
            iif(() => connected,
              EMPTY,
              from(this.connect(username, 5000))
                .pipe(
                  map(() => { return { reconnected: true } }),
                  catchError((err) => {
                    this.notifyOf.warn(`unable to connect. ${retries} attempts remaining...`, 'OK')
                    return this.recursiveTryConnection(username, retries - 1)
                  })
                ))
          ),
          first(),
          catchError((err) => {
            return of({ reconnected: false })
          })
        )
    }
  }

  async connect(username: string, timeoutMs: number) {
    console.log('begin connnection....')
    const token = await firstValueFrom(this.authService.getAccessTokenSilently())

    this.websocketService
      .connect(wssAuthorizeUri(token))
      .pipe(
        catchError(() => EMPTY)
      )
      .subscribe({
        next: (message) => {
          this.firstConnection = true
          this.connectionStatus$.next(true)
          this.messages.next(message)
          console.log(message)
          this.isAutoReconnecting = false
          this.manualDisconnect = false
        },
        error: (error) => {
          console.error('WebSocket error:', error)
          this.manualDisconnect = false
          this.connectionStatus$.next(false)
          this.notifyOf.error('Error Connecting To Socket', 'OK')
        },
        complete: () => {
          console.log('WebSocket connection closed')
          this.connectionStatus$.next(false)
          // this.notifyOf.error('Socket Closed', 'OK')

          if (this.canInitAutoReconnect()) {
            // this.autoReconnect(username)
          }

        },
      })

    // this should handle the first message we receive from the socket connection
    await firstValueFrom(
      this.messages.pipe(
        timeout(timeoutMs),
        tap(authorization => {
          // log and notify connection status
          console.log('Socket Connected')
          this.notifyOf.success('Socket Connected', 'OK')
          // push the users preferred name to the server
          // this.amq.createTypedMessageInterface(SetUsernameMessage).send(username)
          // this.websocketService.sendMessage({ type: convertToKebabCase(SetUsernameMessage.name), data: username })
        })
      )
    )
  }

  private canInitAutoReconnect() {
    return !this.manualDisconnect && this.firstConnection && !this.isAutoReconnecting
  }

  disconnect() {
    this.manualDisconnect = true
    this.websocketService.disconnect()
  }
  send(obj: any) {
    obj.uuid = this.getUUID()
    this.websocketService.sendMessage(obj)
  }

  private getUUID(): any {
    return this.clientMessageId++
  }
}
