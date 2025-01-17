import express from 'express'
import { DependencyContainer } from 'tsyringe'
import { createRequestScopedHandler } from '../../../ioc/scopes/request.scope'
import { EncryptionUtil } from '../../../services/cryptography/encryption-util'

type PingRequest = { s: string }

export default (
  scope: DependencyContainer
) => {
  const requestScopedAction = createRequestScopedHandler(scope, (scope, req, res) => scope)
  const a = new EncryptionUtil()
  const router = express.Router()

  router.use((req, res, next) => {
    next()
  })
  router.post('/balance', requestScopedAction<PingRequest>(
    async (scope, req, res, params, body) => {
      res.send(JSON.stringify({
        enc: a.encryptAndEncode('$100'),
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
