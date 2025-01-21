import { UserInfoObject } from '@talk2resume/types'
import express from 'express'
import { DependencyContainer } from 'tsyringe'
import { IRequestFacade } from '../../server/http/request-facade.interface'
import { FileUploadState, UserFileStorageSettings } from '../../server/http/uploaded-file-helper'
import { registerUserRBACContainer } from '../modules/register-rbac-container'

function getUserProfileFromRequest(req: express.Request) {
  return (req as any as IRequestFacade).userProfile
}

export const createRequestScopedHandler = (
  scope: DependencyContainer,
  configureRequestScope: (
    scope: DependencyContainer,
    req: express.Request,
    res: express.Response,
    params: Map<string, string>
  ) => DependencyContainer
) => {
  return <TBody>(
    action: (
      scope: DependencyContainer,
      req: express.Request,
      res: express.Response,
      params: Map<string, string>,
      body: TBody
    ) => Promise<void>
  ) => {
    return async (
      req: express.Request,
      res: express.Response
    ) => {
      const params = new Map(Object.entries(req.params))

      let requestScope = scope.createChildContainer()
        .registerSingleton(UserInfoObject)
        .register(UserInfoObject, { useValue: getUserProfileFromRequest(req) })
        .registerInstance('current-response', res)
        .registerInstance('current-request', req)
        .register(UserFileStorageSettings, {
          useFactory: () => {
            const { userFileBufferKey } = req as any
            return new UserFileStorageSettings(
              userFileBufferKey,
              ['store', userFileBufferKey].join('/'),
            )
          }
        })
        .register(FileUploadState, {
          useFactory: () => {
            const { chunkIndex, totalChunks, file } = req.body
            const { filename } = file
            const { userFileBufferKey } = req as any
            const chunkBufferPath = ['store', userFileBufferKey, btoa(filename)].join('/')
            const userFilePath = ['store', userFileBufferKey, filename].join('/')
            const complete = Number(chunkIndex) + 1 === Number(totalChunks)

            return new FileUploadState(
              filename,
              chunkIndex,
              totalChunks,
              chunkBufferPath,
              complete,
              userFilePath,
              userFileBufferKey,
            )
          }
        })
      registerUserRBACContainer(requestScope)
      requestScope = configureRequestScope(requestScope, req, res, params)

      try {
        await action(requestScope, req, res, params, req.body)
      } catch (err: any) {
        res.destroy(err)
        console.error(err)
      }
      finally {
        requestScope.reset()
        requestScope.dispose()
      }

    }

  }
}
