import { Express } from 'express'
import { DependencyContainer, inject, singleton } from 'tsyringe'

import { ExpressRouteDefinition, IExpressRouteFactory } from '@talk2resume/common'
import { EXPRESS_APP$$, EXPRESS_ROUTE_FACTORY$$, SCOPED_CONTAINER$$ } from '../../ioc/injection-tokens'


@singleton()
export class ControllerInitializer {
  constructor(
    @inject(SCOPED_CONTAINER$$) public scope: DependencyContainer,
    @inject(EXPRESS_APP$$) public express: Express,
  ) {
    this.scope.resolveAll<ExpressRouteDefinition>(EXPRESS_ROUTE_FACTORY$$)
      .map(({ path, useClass }) => ({ path, route: scope.resolve<IExpressRouteFactory>(useClass).create(scope) }))
      .reduce((server, { path, route }) => server.use(path, route), express)
  }
}
