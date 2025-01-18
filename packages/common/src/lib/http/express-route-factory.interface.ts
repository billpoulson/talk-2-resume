import { Router } from 'express'
import { DependencyContainer, InjectionToken } from 'tsyringe'

export interface IExpressRouteFactory { create(scope: DependencyContainer): Router }
export interface ExpressRouteDefinition {
  path: string
  useClass: InjectionToken<IExpressRouteFactory>
}
