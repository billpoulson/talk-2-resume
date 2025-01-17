import { injectable } from 'tsyringe'

@injectable()
export class MongoDbSettings {
  constructor(public connectionstring: string) { }
}