import {
  AppController,
  hasContent,
  trimWhitespace
} from '@talk2resume/common'
import { Request } from 'express'
import { IncomingMessage, Server } from 'http'
import { concatMap, map, of, tap } from 'rxjs'
import { DependencyContainer, inject, singleton } from 'tsyringe'
import WebSocket from 'ws'
import { EXPRESS_SERVER$$, SCOPED_CONTAINER$$ } from '../../ioc/injection-tokens'
import { createClientScope } from '../../ioc/scopes/create-client-scope'
import { JWTTokenAuthenticationService } from '../../services/security/jwt-token-authentication-service'
import { ClientWebsocketConnectionInstance } from '../../services/sockets/socket-connection-info'


@singleton()
export class WebSocketServer implements AppController {
  connectionI = 0;
  wss: WebSocket.Server<typeof WebSocket, typeof IncomingMessage>
  connections = new Map<string, ClientWebsocketConnectionInstance>()

  constructor(
    @inject(EXPRESS_SERVER$$) server: Server,
    @inject(SCOPED_CONTAINER$$) public scope: DependencyContainer,
    private jwtAuthService: JWTTokenAuthenticationService,
  ) {
    this.wss = new WebSocket.Server({ server })// Create WebSocket server
    this.wss.on('connection', this.tryStartClientContainer.bind(this))// Handle WebSocket connections
  }

  acceptConnectionHandler(
    ws: WebSocket,
    req: Request
  ) {
    const tempConnectionId = this.connectionI++
    // try to authorize the user, and return their profile
    return of(req)
      .pipe(
        // timeout(10000),// allow up to 10 seconds to accept connection
        map(req => this.getTokenFromRequest(req)),
        concatMap(token => this.jwtAuthService.tryVerifyOauthToken(token)),
        map(([_, profile]) => ClientWebsocketConnectionInstance.create(profile!, ws)),
        tap(connection => {
          console.info(`connection#:${tempConnectionId} → connectionId: ${connection.connectionId}`)
          this.connections.set(connection.connectionId, connection)
        }),
        map((clientConnection) => createClientScope(this.scope, clientConnection)),
      )
  }

  async tryStartClientContainer(ws: WebSocket, req: Request) {
    this.acceptConnectionHandler(ws, req)
      .subscribe({
        next: (container => {
          // if a container was produced, this will start the websocket for the client
          container?.activate()
        }),
        error: (err) => {
          ws.close(1000, 'not authorized')
          console.warn(`connection rejected: ${err}`)
        },
        complete: () => {
        }
      })
  }

  private getTokenFromRequest(req): string {
    const [base, action, token] = req.url
      .split('/')
      .map(trimWhitespace)
      .filter(hasContent)

    if (base == 'wss' && action == 'authorize') return token

    throw 'invalid connection attempt'
  }
}
