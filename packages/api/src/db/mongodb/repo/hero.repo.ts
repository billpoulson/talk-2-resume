import { UserRBAC } from '@talk2resume/common'
import { Resource } from '@talk2resume/types'
import { Db, ObjectId } from 'mongodb'
import { injectable } from 'tsyringe'
import { BaseRepository } from '../base-repository'

@injectable()
export class HeroRepository extends BaseRepository<{}> {
  constructor(
    db: Db,
    rbac: UserRBAC
  ) {
    super(
      db,
      Resource.Ship,
      rbac.createResourceScopedRBAC(Resource.Ship)
    )
  }

  countOfHeroes(): Promise<number> {
    return this._collection.count({})
  }
}

export interface UserFileEntity {
  _id?: ObjectId
  userPath: string
  parentKey?: string
  text: string
  path: string
  type: 'file' | 'folder'
}

@injectable()
export class UserFileRepository extends BaseRepository<UserFileEntity> {
  constructor(
    db: Db,
    rbac: UserRBAC
  ) {
    super(
      db,
      Resource.UserFiles,
      rbac.createResourceScopedRBAC(Resource.UserFiles)
    )
  }
}
