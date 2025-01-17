import path from 'path'
import { DependencyContainer } from 'tsyringe'
import { AppDbConfig } from '../../db/jsondb/core/config'
import { SCOPED_CONTAINER$$, STATIC_CONTENT_PATH$$ } from '../injection-tokens'

export const registerBootstrapper = (container: DependencyContainer) => {
  container
    .register(SCOPED_CONTAINER$$, { useValue: container })
    .register(STATIC_CONTENT_PATH$$, { useFactory: () => path.join(__dirname, 'public') })
    .register(AppDbConfig, { useValue: { path: 'db.json' } }) // jsondb config
}
