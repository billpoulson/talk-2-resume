import { CacheEntry, UserInfoObject } from '@talk2resume/types'
import { firstValueFrom } from 'rxjs'
import { container } from 'tsyringe'
import { RedisRef } from '../../services/cache/redis'
import { JWTTokenAuthenticationService } from '../../services/security/jwt-token-authentication-service'



export function userProfileCacheMiddleware(
  tokenAuthService: JWTTokenAuthenticationService
) {

  return async (req: any, res, next) => {
    const { redis } = container.resolve(RedisRef)
    if (!redis.isOpen) {
      await redis.connect()
    }
    const cacheKey = req.auth.payload.sub
    try {
      const value = await redis.get(cacheKey)

      let userProfile: UserInfoObject
      if (value) {
        const cachedProfile = JSON.parse(value) as CacheEntry<UserInfoObject>
        userProfile = cachedProfile.data
      } else {
        userProfile = await firstValueFrom(tokenAuthService.getUserInfo(req.auth))
        const newCacheEntry = new CacheEntry(userProfile, {
          CreatedByResource: "talk2resume-api"
        })
        await redis.set(cacheKey, JSON.stringify(newCacheEntry))
      }
      if (userProfile) {
        req.userProfile = userProfile
        req.userFileBufferKey = btoa(userProfile.email)
      }

    } catch (err: any) {
      debugger
    }
    next()
  }
}
