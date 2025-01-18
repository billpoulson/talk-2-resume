import { IExpressRouteFactory } from '@talk2resume/common'
import { UserInfoObject } from '@talk2resume/types'
import express from 'express'
import { finalize, firstValueFrom, timer } from 'rxjs'
import { DependencyContainer } from 'tsyringe'
import { createRequestScopedHandler } from '../../../ioc/scopes/request.scope'

type PingRequest = { s: string }
export class SmokeTestRouteFactory implements IExpressRouteFactory {
  create(scope: DependencyContainer): express.Router {
    const requestScopedAction = createRequestScopedHandler(scope, (scope, req, res) => { 
      //configure the dependency container for the active request
      return scope
     })

    const router = express.Router()

    router.get('/ping/:response', requestScopedAction<PingRequest>(
      async (scope, req, res, params, body) => {
        const [userInfo] = [
          scope.resolve(UserInfoObject),
        ]
        // repo.incrementLoginCount(`${+new Date}`)
        res.send(params.get('response'))
      }))

    router.get('/await/:ms', requestScopedAction<PingRequest>(
      async (scope, req, res, params, body) => {
        await firstValueFrom(
          timer(+params.get('ms')!)
            .pipe(
              finalize(() => {
                res.send(params.get('ms'))
              })
            )
        )
      }))

    return router
  }
}
