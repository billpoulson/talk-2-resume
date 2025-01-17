import cors from 'cors'
import express from 'express'
import { auth } from 'express-oauth2-jwt-bearer'
import { Server } from 'http'
import { DependencyContainer, inject, singleton } from 'tsyringe'
import { AppDbContext } from '../../db/jsondb/core/context'
import {
  EXPRESS_APP$$,
  EXPRESS_SERVER$$, SCOPED_CONTAINER$$, STATIC_CONTENT_PATH$$
} from '../../ioc/injection-tokens'
import { AUTH_AUDIENCE$$, AUTH_ISSUER_DOMAIN$$ } from '../../ioc/security/injection-tokens'
import { AppConfig } from '../../server/app-config'
import { JWTTokenAuthenticationService } from '../../services/security/jwt-token-authentication-service'
import { WebSocketServer } from '../socket$/websocket.server'
import { ControllerInitializer } from './controller.registry'
import routdd from './controllers/balance.controller'
import pingRouteModule from './controllers/smoke-test.controller'
import { corsWhitelist } from './cors-whitelist'

@singleton()
export class ExpressServerContainer {
  public app = express()
  public db = {} as any
  public server!: Server
  oauth2Middleware: express.Handler
  corsMiddleware: express.Handler
  constructor(
    @inject(SCOPED_CONTAINER$$) public scope: DependencyContainer,
    private appDb: AppDbContext,
    private appConfig: AppConfig,
    private tokenAuthService: JWTTokenAuthenticationService,
    @inject(AUTH_AUDIENCE$$) audience: string,
    @inject(AUTH_ISSUER_DOMAIN$$) issuerDomain: string,
    @inject(STATIC_CONTENT_PATH$$) private staticContentPath: string,
  ) {
    console.info(this.constructor.name)
    this.oauth2Middleware = auth({
      audience,
      issuerBaseURL: `https://${issuerDomain}/`,
      tokenSigningAlg: 'RS256',
    })

    this.corsMiddleware = cors({
      origin: function (origin, callback) {
        if (!origin || corsWhitelist.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
      credentials: true,
    })
  }

  public async init() {

    this.app = express()
      .use(express.static(this.staticContentPath))
      .use(this.oauth2Middleware)
      .use(this.corsMiddleware)
      .use(express.json())
      .options('*', this.corsMiddleware)
      .use(async (req: any, res, next) => {
        const userProfile = await this.tokenAuthService.getUserInfo(req.auth.token)
        req.userProfile = userProfile
        next()
      })
      .use('/test', routdd(this.scope))
      .use('/_', pingRouteModule(this.scope))

    this.scope
      .register(EXPRESS_SERVER$$, {
        useFactory: () => this.app.listen(this.appConfig.port, () => {
          console.log('Running on port ', this.appConfig.port)
        })
      })
      .register(EXPRESS_APP$$, {
        useFactory: () => this.app
      })

    await this.appDb.init()
    this.db = this.appDb.loginsDB

    this.scope.resolve(WebSocketServer)
    this.scope.resolve(ControllerInitializer)
  }
}
