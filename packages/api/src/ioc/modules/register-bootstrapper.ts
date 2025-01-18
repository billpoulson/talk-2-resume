import path from 'path'
import { DependencyContainer } from 'tsyringe'
import { SCOPED_CONTAINER$$, STATIC_CONTENT_PATH$$ } from '../injection-tokens'

export const registerBootstrapper = (container: DependencyContainer) => {
  container
    .register(SCOPED_CONTAINER$$, { useValue: container })
    .register(STATIC_CONTENT_PATH$$, { useFactory: () => path.join(__dirname, 'public') })
}


