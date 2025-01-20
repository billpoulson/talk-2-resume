import { ApplicationConfig, provideAppInitializer, provideZoneChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { authHttpInterceptorFn } from '@auth0/auth0-angular'
import { appInitFn } from './app.init'
import { routes } from './app.routes'
import { FileUploadInterceptor } from './features/interceptors/file-upload.interceptor'
import { LoadingInterceptor } from './features/interceptors/loading-interceptor.interceptor'


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideAppInitializer(appInitFn),
    // provideClientLogger(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FileUploadInterceptor,
      multi: true
    },
    provideHttpClient(
      withInterceptors([
        authHttpInterceptorFn,
      ]),
      withInterceptorsFromDi(),
    ),

  ],
}

// function provideClientLogger() {
//   return {
//     provide: LoggingConfig,
//     useFactory: () => {
//       const isProduction = environment.node_env == 'production'
//       return new LoggingConfig(
//         '', isProduction ? 'INFO' : 'DEBUG'
//       )
//     }
//   }
// }

