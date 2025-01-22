import { config as configDotenv } from 'dotenv'
import 'reflect-metadata'

import { container } from 'tsyringe'
import { RootEntryPoint } from './ioc/entry-points/root.entry-point'
import { registerOauth2ModuleForRoot } from './ioc/modules/register-auth-module-for-root'
import { registerBootstrapper } from './ioc/modules/register-bootstrapper'
import { registerExpressRoutes } from './ioc/modules/register-express-routes'
import { registerMongoDbForRoot } from './ioc/modules/register-mongo-db-for-root'
import { registerOllamaBackendForRoot } from './ioc/modules/register-ollama-backend-for-root'
import { registerApplicationRBACContainerForRoot } from './ioc/modules/register-rbac-container'
import { registerRedisForRoot } from './ioc/modules/register-redis-for-root'

configDotenv()
const rootModules = [
  registerBootstrapper,
  registerOauth2ModuleForRoot,
  registerOllamaBackendForRoot,
  registerMongoDbForRoot,
  registerApplicationRBACContainerForRoot,
  registerExpressRoutes,
  registerRedisForRoot
]
rootModules.forEach(element => { element(container) })

container
  .resolve(RootEntryPoint)
  .bootstrap()
