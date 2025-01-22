

import { createClient } from 'redis'
import { DependencyContainer } from 'tsyringe'
import { REDIS_CLIENT$$, RedisRef } from '../../services/cache/redis'

export function registerRedisForRoot(
    scope: DependencyContainer
): DependencyContainer {
    return scope
        .registerSingleton(RedisRef)
        .register(REDIS_CLIENT$$, {
            useFactory: (dep: DependencyContainer) => {
                const url = process.env['REDIS_CONNECTION_STRING'] ?? 'redis://127.0.0.1:6379'
                console.info(`using redis server url: ${url} `)
                const client = createClient({ url })
                client.on('error', (err) => console.error('Redis Client Error', err))
                return client
            }
        })
}
