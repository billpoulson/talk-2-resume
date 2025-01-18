import { UserInfoObject } from '@talk2resume/types'
import { JWTTokenAuthenticationService } from '../../services/security/jwt-token-authentication-service'

export function userProfileCacheMiddleware(
  tokenAuthService: JWTTokenAuthenticationService
) {
  const cache = new Map<any, { userProfile: UserInfoObject, exp: Date }>
  return async (req: any, res, next) => {
    const cachedProfile = cache.get(req.auth.token)
    if (!cachedProfile || cachedProfile.exp < new Date) {
      const userProfile = await tokenAuthService.getUserInfo(req.auth.token)
      const exp = new Date()
      exp.setSeconds(exp.getSeconds() + 120)
      cache.set(req.auth.token, { userProfile, exp })
    }
    req.userProfile = cache.get(req.auth.token)?.userProfile
    req.userFileBufferKey = btoa(req.userProfile.email)
    next()
  }
}
