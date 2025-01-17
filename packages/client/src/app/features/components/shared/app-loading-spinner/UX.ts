import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '@auth0/auth0-angular'
import { catchError, concatMap, finalize, first, firstValueFrom, map, Observable, of, timeout } from 'rxjs'
import { DEFAULT_LOADING_CONTEXT, LoadingStatusService } from './loading-status.service'



@Injectable({
  providedIn: 'root'
})
export class UX {
  constructor(
    private loadingStatus: LoadingStatusService,
    private authService: AuthService,
    private router: Router
  ) { }

  withLogin$() {
    return firstValueFrom(
      this.withLoadingStatus$(':login',
        this.authService.isAuthenticated$
          .pipe(
            timeout(3000),
            first(),
            catchError(async (err, caught) =>
              this.authService.loginWithRedirect({
                appState: {
                  target: window.location.pathname
                }
              })),
          )
      ))

  }

  withLoadingStatus$<TData>(
    key: string,
    source: Observable<TData>,
    context: string = DEFAULT_LOADING_CONTEXT
  ) {
    return of(true)
      .pipe(
        concatMap(_ => {
          this.loadingStatus.show(key, context)
          return source.pipe(
            first(),
            finalize(() => {
              this.loadingStatus.hide(key, context)
            })
          )
        }),
      )
  }

  useLoadingStatus$(context: string = DEFAULT_LOADING_CONTEXT) {
    return this.loadingStatus.loading$
      .pipe(map((state) => state?.[context] || false))
  }

}
