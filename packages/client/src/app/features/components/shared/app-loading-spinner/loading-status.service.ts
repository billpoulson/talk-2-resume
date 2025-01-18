import { Injectable } from '@angular/core'
import { Dictionary } from '@talk2resume/types'
import { BehaviorSubject, map, Observable } from 'rxjs'

export const DEFAULT_LOADING_CONTEXT = 'global'
@Injectable({
  providedIn: 'root'
})
export class LoadingStatusService {
  uploadStatus = new Map<string, { key: string, group: string, message: string }>

  public getStatusText$ = new BehaviorSubject("")
  private contexts = new BehaviorSubject<{ [key: string]: Dictionary<boolean> }>({});
  public loading$: Observable<{ [key: string]: boolean }>


  constructor() {


    this.loading$ =
      this.createLoadingStatus$()
  }

  private createLoadingStatus$(): Observable<{ [key: string]: boolean }> {
    return this.contexts
      .pipe(
        map(state => Object.keys(state)
          .reduce((acc, context) => {
            acc[context] = Object.values(state[context]).some(x => x)
            return acc
          }, {} as { [key: string]: boolean })
        )
      )
  }

  show(
    uri: string,
    context: string = DEFAULT_LOADING_CONTEXT
  ) {
    const delta = { ...this.contexts.value }
    if (!delta[context]) delta[context] = {}
    if (delta[context][uri] == undefined) delta[context][uri] = true
    console.log('increment', context, delta[context])

    this.contexts.next(delta)
  }

  hide(uri: string, context: string = DEFAULT_LOADING_CONTEXT) {
    const delta = { ...this.contexts.value }
    if (delta?.[context]?.[uri]) {
      delta[context][uri] = false
    }
    this.contexts.next(delta)
  }

  createIsLoading$(context: string = DEFAULT_LOADING_CONTEXT) {
    return this.loading$
      .pipe(map((state) => (state?.[context] || false)))
  }
}


