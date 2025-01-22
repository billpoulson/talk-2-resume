import { RedisClientType } from 'redis'
import { inject, injectable } from 'tsyringe'

export const REDIS_CLIENT$$ = "RedisClient"
@injectable()
export class RedisRef {
  constructor(@inject(REDIS_CLIENT$$) public redis: RedisClientType) { }
}
