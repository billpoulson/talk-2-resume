import { Low } from 'lowdb/lib/core/Low'
import { singleton } from 'tsyringe'
import { LoginDBSchema } from '../schema/logins.db.schema'
import { AppDbContext } from './context'

@singleton()
export class AppDbRepo {
  public loginsDB: Low<LoginDBSchema>

  constructor(
    appDb: AppDbContext
  ) {
    this.loginsDB = appDb.loginsDB
  }
}

