import { bootstrapApplication } from '@angular/platform-browser'
import { AppComponent } from './app/app.component'
import { appConfig } from './app/app.config'
import { buildClientAuth0Provider } from './bootstrapper.build-client-auth-provider'

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    buildClientAuth0Provider()
  ]
}).catch((err) => console.error(err))

