import { DependencyContainer, InjectionToken } from 'tsyringe'
import { BalanceRouteFactory } from '../../server/http/routes/balance'
import { SmokeTestRouteFactory } from '../../server/http/routes/smoke-test'
import { UserUploadControllerRouteFactory } from '../../server/http/routes/user-upload'
import { EXPRESS_ROUTE_FACTORY$$ } from '../injection-tokens'


export const registerExpressRoutes = (
  container: DependencyContainer
) => {
  const registerFactory = (path: string, useClass: InjectionToken) => {
    container.register(EXPRESS_ROUTE_FACTORY$$, { useValue: { path, useClass } })
  }

  registerFactory('/balance', BalanceRouteFactory)
  registerFactory('/_', SmokeTestRouteFactory)
  registerFactory('/uploads', UserUploadControllerRouteFactory)
}

