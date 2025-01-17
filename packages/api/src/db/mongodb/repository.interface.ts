import { OptionalUnlessRequiredId, WithId } from 'mongodb'
// repositories/IRepository.ts
// export interface IRepository<T> {
//   findAll(filter?: Filter<T>): Promise<WithId<T>[]>
//   findById(id: string): Promise<WithId<T>[]>
//   create(entity: T): Promise<T>
//   update(id: string, entity: Partial<T>): Promise<boolean>
//   delete(id: string): Promise<boolean>
// }


export interface IRead<T> {
  find(item: T): Promise<WithId<T>[]>
  findById(id: string): Promise<WithId<T> | null>
}



export interface IWrite<T> {
  create(item: OptionalUnlessRequiredId<T>): Promise<boolean>
  update(id: string, item: T): Promise<boolean>
  delete(id: string): Promise<boolean>
}
