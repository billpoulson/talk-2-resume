import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { finalize, Observable } from 'rxjs'
import { LoadingStatusService } from '../components/shared/app-loading-spinner/loading-status.service'

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(
    private loadingService: LoadingStatusService
  ) {
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler

  ): Observable<HttpEvent<unknown>> {
    const isChunkedUpload = Boolean(request.headers.get('chunked-upload'))
    if (isChunkedUpload) { return next.handle(request) }

    if (request.method === 'OPTIONS') {
      return next.handle(request)
    }
    this.loadingService.show(request.url)

    return next.handle(request)
      .pipe(
        finalize(() => {
          this.loadingService.hide(request.url)
        })
      )
  }
}


