import { UserInfoObject } from '@talk2resume/types'
import { Request, Response } from 'express'
import { DependencyContainer } from 'tsyringe'
import { IRequestFacade } from '../../server/http/request-facade.interface'

function getUserProfileFromRequest(req: Request) {
  return (req as any as IRequestFacade).userProfile
}

export const createRequestScopedHandler = (
  scope: DependencyContainer,
  configureRequestScope: (
    scope: DependencyContainer,
    req: Request,
    res: Response,
    params: Map<string, string>
  ) => DependencyContainer
) => {
  return <TBody>(
    action: (
      scope: DependencyContainer,
      req: Request,
      res: Response,
      params: Map<string, string>,
      body: TBody
    ) => Promise<void>
  ) => {
    return async (
      req: Request,
      res: Response
    ) => {
      const params = new Map(Object.entries(req.params))

      let requestScope = scope.createChildContainer()
        .registerSingleton(UserInfoObject)
        .register(UserInfoObject, { useValue: getUserProfileFromRequest(req) })

      requestScope = configureRequestScope(requestScope, req, res, params)

      await action(requestScope, req, res, params, req.body)

      requestScope.reset()
      requestScope.dispose()
    }

  }
}
