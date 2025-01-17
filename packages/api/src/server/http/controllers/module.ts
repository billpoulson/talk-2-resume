import { Router } from 'express'
import { DependencyContainer } from 'tsyringe'
import balanceModule from './balance.controller'
import pingModule from './smoke-test.controller'

export const routeModules: Array<[string, (scope: DependencyContainer) => Router]> = [
  ['/balance', balanceModule],
  ['/_', pingModule]
]
