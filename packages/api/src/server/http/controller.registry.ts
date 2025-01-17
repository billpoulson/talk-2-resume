import { Express } from 'express'
import { DependencyContainer, inject, singleton } from 'tsyringe'

import { EXPRESS_APP$$, SCOPED_CONTAINER$$ } from '../../ioc/injection-tokens'
import { routeModules } from './controllers/module'

@singleton()
export class ControllerInitializer {
  constructor(
    @inject(SCOPED_CONTAINER$$) public scope: DependencyContainer,
    @inject(EXPRESS_APP$$) public express: Express,
  ) {
    routeModules.map(([path, fn]) => express.use(path, fn(scope)))
  }
}
