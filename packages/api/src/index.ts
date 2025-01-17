import { config as configDotenv } from 'dotenv'
import 'reflect-metadata'

import { container } from 'tsyringe'
import { registerOauth2ModuleForRoot } from './ioc/modules/create-auth-module-for-root'
import { registerBootstrapper } from './ioc/modules/register-bootstrapper'
import { registerMongoDbForRoot } from './ioc/modules/register-mongo-db-for-root'
import { registerOllamaBackendForRoot } from './ioc/modules/register-ollama-backend-for-root'
import { registerApplicationRBACContainerForRoot } from './ioc/modules/register-rbac-container'
import { RootEntryPoint } from './root.entry-point'
configDotenv()
const rootModules = [
  registerBootstrapper,
  registerOauth2ModuleForRoot,
  registerOllamaBackendForRoot,
  registerMongoDbForRoot,
  registerApplicationRBACContainerForRoot,
]
rootModules.forEach(element => { element(container) })

container
  .resolve(RootEntryPoint)
  .bootstrap()
