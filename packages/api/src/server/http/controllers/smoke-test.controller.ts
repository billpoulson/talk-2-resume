import { UserInfoObject } from '@talk2resume/types'
import express from 'express'
import { finalize, firstValueFrom, timer } from 'rxjs'
import { DependencyContainer } from 'tsyringe'
import { LoginsRepo } from '../../../db/jsondb/login.repo'
import { createRequestScopedHandler } from '../../../ioc/scopes/request.scope'

type PingRequest = { s: string }

export default (
  scope: DependencyContainer
) => {
  const requestScopedAction = createRequestScopedHandler(scope, (scope, req, res) => { return scope })

  const router = express.Router()

  router.get('/ping/:response', requestScopedAction<PingRequest>(
    async (scope, req, res, params, body) => {
      const [repo, userInfo] = [
        scope.resolve(LoginsRepo),
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
