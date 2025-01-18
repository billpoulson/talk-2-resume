import { IExpressRouteFactory } from '@talk2resume/common'
import express, { Router } from 'express'
import { DependencyContainer, injectable } from 'tsyringe'
import { createRequestScopedHandler } from '../../../ioc/scopes/request.scope'
import { EncryptionUtil } from '../../../services/cryptography/encryption-util'

type PingRequest = { s: string }

@injectable()
export class BalanceRouteFactory implements IExpressRouteFactory {
  create(scope: DependencyContainer): Router {
    const requestScopedAction = createRequestScopedHandler(scope, (scope, req, res) => scope)
    const crypt = new EncryptionUtil()
    const router = express.Router()

    router.use((req, res, next) => {
      next()
    })

    router.post('/balance', requestScopedAction<PingRequest>(
      async (scope, req, res, params, body) => {
        res.send(JSON.stringify({
          enc: crypt.encryptAndEncode('$100'),
          org: '$100'
        }))
      }))

    // Define routes for the "users" module
    router.get('/', (req, res) => {
      res.send('List of users')
    })

    router.get('/:id', (req, res) => {
      res.send(`User details for ID: ${req.params.id}`)
    })

    router.post('/', (req, res) => {
      res.send('Create a new user')
    })

    return router
  }

}
