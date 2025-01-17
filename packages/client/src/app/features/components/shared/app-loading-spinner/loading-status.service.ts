import { Injectable, NgZone } from '@angular/core'
import { BehaviorSubject, concatMap, finalize, first, map, Observable, of, tap } from 'rxjs'

export const DEFAULT_LOADING_CONTEXT = 'global'
@Injectable({
  providedIn: 'root'
})
export class LoadingStatusService {
  // Tracks request counts for each context
  private contexts: { [key: string]: any } = {};
  private loadingSubject = new BehaviorSubject<{ [key: string]: boolean }>({});
  public loading$: Observable<{ [key: string]: boolean }> = this.loadingSubject.asObservable();

  constructor(private zone: NgZone) { }

  show(
    uri: string,
    context: string = DEFAULT_LOADING_CONTEXT
  ) {
    if (!this.contexts[context]) this.contexts[context] = {}
    if (!this.contexts[context][uri]) this.contexts[context][uri] = true
    console.log('increment', context, this.contexts[context])

    this.updateLoadingState()
  }

  hide(uri: string, context: string = DEFAULT_LOADING_CONTEXT) {
    if (this.contexts?.[context]?.[uri]) {
      delete this.contexts[context][uri]
    }

    console.log('decrement', context, this.contexts[context])
    this.updateLoadingState()
  }

  private updateLoadingState() {
    const loadingState = Object.keys(this.contexts)
      .reduce((acc, context) => {
        acc[context] = Object.keys(this.contexts[context]).length > 0
        console.log(this.contexts[context])
        return acc
      }, {} as { [key: string]: boolean })

    this.loadingSubject.next(loadingState)
  }

   withLoadingStatus$<TData>(
      key: string,
      source: Observable<TData>,
      context: string = DEFAULT_LOADING_CONTEXT
    ) {
      return of()
        .pipe(
          tap(_ => { 
            debugger
            this.show(key, context) }),
          concatMap(_ => source),
          first(),
          finalize(() => {
            this.hide(key, context)
          })
        )
    }
  
    createIsLoading$(context: string = DEFAULT_LOADING_CONTEXT) {
      return this.loading$
        .pipe(map((state) => state?.[context] || false))
    }
}
