import jwksClient, { JwksClient } from 'jwks-rsa'
import { DependencyContainer } from 'tsyringe'
import { JWTVerifyOptions } from '../../services/security/oauth/jwt-verify-options'
import { AUTH_AUDIENCE$$, AUTH_ISSUER_DOMAIN$$ } from '../security/injection-tokens'

export function registerOauth2ModuleForRoot(
    scope: DependencyContainer
): DependencyContainer {
    return scope
        .register(AUTH_AUDIENCE$$, { useFactory: () => process.env['AUTH_AUDIENCE'] })
        .register(AUTH_ISSUER_DOMAIN$$, { useFactory: () => process.env['AUTH_ISSUER'] })
        .register(AUTH_AUDIENCE$$, { useFactory: () => process.env['AUTH_AUDIENCE'] })
        .register(JwksClient, jwksClientFactory)
        .register(JWTVerifyOptions, jwtVerifyOptionsFactory)

}

const jwksClientFactory = {
    useFactory: (deps: DependencyContainer) => {
        const issuer = deps.resolve(AUTH_ISSUER_DOMAIN$$)
        return jwksClient({ jwksUri: `https://${issuer}/.well-known/jwks.json` })
    }
}

const jwtVerifyOptionsFactory = {
    useFactory: (deps: DependencyContainer) => {
        const issuer = deps.resolve(AUTH_ISSUER_DOMAIN$$)
        const audience = deps.resolve(AUTH_AUDIENCE$$)
        return ({
            audience,
            issuer: `https://${issuer}/`,
            algorithms: ['RS256']
        })
    }
}