import { AppRBACFn } from '@talk2resume/common'
import { Actions } from '@talk2resume/types'
import {
    Collection,
    Db,
    DeleteResult,
    Document,
    Filter,
    InsertOneResult,
    ObjectId,
    OptionalUnlessRequiredId,
    UpdateResult,
    WithId
} from 'mongodb'
import { IRead, IWrite } from './repository.interface'

export abstract class BaseRepository<T extends Document>
  implements IWrite<T>, IRead<T> {
  public readonly _collection: Collection<T>

  constructor(
    db: Db,
    collectionName: string,
    private rbac: AppRBACFn
  ) {
    
    this._collection = db.collection<T>(collectionName)
  }
  findById(id: string): Promise<WithId<T> | null> {
    throw new Error('Method not implemented.')
  }

  async create(item: OptionalUnlessRequiredId<T>): Promise<boolean> {
    const { allow, data } = this.rbac(Actions.Create, item)
    if (!allow) { return Promise.resolve(false) }

    const result: InsertOneResult<Document> =
      await this._collection.insertOne(item)

    return !!result.acknowledged
  }

  async update(id: string, item: Partial<T>): Promise<boolean> {
    const { allow, data } = this.rbac(Actions.Update, item)
    if (!allow) { return Promise.resolve(false) }

    const result: UpdateResult = await this._collection.updateOne(
      { _id: new ObjectId(id) } as Filter<T>,
      { $set: item }
    )

    return result.modifiedCount > 0
  }

  async delete(id: string): Promise<boolean> {
    const { allow } = this.rbac(Actions.Delete)
    if (!allow) { return Promise.resolve(false) }

    const result: DeleteResult = await this._collection.deleteOne(
      { _id: new ObjectId(id) } as Filter<T>
    )

    return result.deletedCount > 0
  }

  async find(filter: Filter<T> = {}): Promise<WithId<T>[]> {
    const { allow } = this.rbac(Actions.Read)
    if (!allow) { return Promise.resolve([]) }

    const results = await this._collection.find(filter).toArray()
    return results
  }

  async findOne(id: string): Promise<WithId<T> | null> {
    const { allow } = this.rbac(Actions.Read)
    if (!allow) { return Promise.resolve(null) }

    const result = await this._collection.findOne(
      { _id: new ObjectId(id) } as Filter<T>
    )

    return result
  }
}

