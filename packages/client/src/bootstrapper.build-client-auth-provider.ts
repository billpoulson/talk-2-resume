import { provideAuth0 } from '@auth0/auth0-angular'
import { environment } from './environment'

export function buildClientAuth0Provider() {
  return provideAuth0({
    domain: environment.auth_issuer,
    clientId: environment.auth_client_id,
    authorizationParams: {
      redirect_uri: window.location.origin ,
      audience: environment.auth_audience,
    },
    httpInterceptor: {
      allowedList: [
        "/api/*",
      ],
    },
  })
}
