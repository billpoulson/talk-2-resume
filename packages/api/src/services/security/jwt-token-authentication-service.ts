import { UserInfoObject } from '@talk2resume/types'
import jwt from 'jsonwebtoken'
import { JwksClient } from 'jwks-rsa'
import fetch from 'node-fetch'
import { concatMap, firstValueFrom, from, map, Observable } from 'rxjs'
import { inject, singleton } from 'tsyringe'
import { AUTH_ISSUER_DOMAIN$$ } from '../../ioc/security/injection-tokens'
import { JWTVerifyOptions } from './oauth/jwt-verify-options'

type TokenVerificationResponse = [boolean, UserInfoObject | undefined]
@singleton()
export class JWTTokenAuthenticationService {
  constructor(
    @inject(AUTH_ISSUER_DOMAIN$$) private issuerDomain: string,
    private client: JwksClient,
    private options: JWTVerifyOptions
  ) { }
  private getKey(header: any, callback: any) {
    this.client.getSigningKey(header.kid, (err, key: any) => {
      if (err) {
        callback(err, null)
        return
      }
      const signingKey = key.publicKey || key.rsaPublicKey
      callback(null, signingKey)
    })
  }

  private verifyToken(token: string): Promise<UserInfoObject> {
    const get = this.getKey.bind(this)
    return new Promise((resolve, reject) => {
      jwt.verify(token, get, this.options, async (err, decoded) => {
        if (err) {
          reject(`Token verification failed: ${err.message}`)
        } else {
          firstValueFrom(this.getUserInfo({ token })).then(resolve)
        }
      })
    })
  }

  getUserInfo({ token, payload }: { token: string, payload?: any }): Observable<UserInfoObject> {
    return from(fetch(
      `https://${this.issuerDomain}/userinfo`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })).pipe(
      concatMap(response => from(response.json()) as Observable<any>),
      map(response => ({
        ...response,
        permissions: payload?.permissions ?? ['guest']
      } as any))
    )
  }


  tryVerifyOauthToken(
    token: string
  ): Observable<TokenVerificationResponse> {
    return from(this.verifyToken(token))
      .pipe(
        map(val => [true, val] as TokenVerificationResponse)
      )
  }
}
