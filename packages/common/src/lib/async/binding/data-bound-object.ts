import { BehaviorSubject, Observable, Subject, Subscription, concatMap, finalize, first, of, race, takeUntil, tap } from 'rxjs'
import { forwardTo } from '../../rxjs.extensions'
import { LoadingState, isLoaded } from '../../state'
import { IDataBoundObject } from './data-bound-object.interface'

export abstract class DataBoundObject<TData>
  implements IDataBoundObject<TData> {
  public data$: Observable<TData | LoadingState>
  public fetch() {
    this.tryActivateResolver()
    this.reload$.next(+new Date)
  }
  public update(
    createPatch: (data: TData | LoadingState) => Observable<any>,
    pushUpdate = false
  ) {
    return this.data$
      .pipe(
        concatMap(state => createPatch(state)),
        concatMap(patch => this._update(patch as TData)),
        tap(patch => {
          if (pushUpdate) {
            this._subject.next(patch)
          }
        }),
        finalize(() => {
          if (!pushUpdate) {
            return this.fetch()
          }
        })
      )
  }

  public dispose() { this.dipose$.next(); this.dipose$.complete() }

  private tryActivateResolver() {
    if (!this.resolver$$) {
      this.resolver$$ = this.resolver$
        .subscribe()
    }
    return this.resolver$$
  }

  private createDataResolver$(
    subject$: BehaviorSubject<TData | LoadingState>,
    fetch$: Observable<TData>
  ) {
    return of(this.createSource$(
      subject$,
      fetch$
    ))
      .pipe(
        tap(source$ => { this.listenForReloadSignal(source$) }),
        concatMap(source$ => this.createDataResolver(source$, subject$))
      )
  }

  private createDataResolver(
    source$: Observable<TData | LoadingState>,
    subject$: BehaviorSubject<TData | LoadingState>
  ): Observable<TData | LoadingState> {
    return race(
      of(LoadingState.Loading)
        .pipe(
          takeUntil(this.dipose$),
          concatMap(() => source$)
        ),
      subject$.pipe(
        takeUntil(this.dipose$),
        isLoaded()
      )
    )
  }

  private createSource$(
    subject$: BehaviorSubject<TData | LoadingState>,
    fetch$: Observable<TData>
  ) {
    return of(LoadingState.Loading)
      .pipe(
        forwardTo(subject$), // set to loading
        concatMap(() => fetch$.pipe(first())), // get the datasource
        forwardTo(subject$)
      )
  }

  private listenForReloadSignal(
    source$: Observable<TData | LoadingState>
  ) {
    return this.reload$
      .pipe(
        takeUntil(this.dipose$),
        concatMap(x => source$)
      )
      .subscribe()
  }


  dipose$ = new Subject<void>()
  update$ = new Subject<TData>()
  reload$ = new Subject<number>
  resolver$: Observable<TData | LoadingState>
  resolver$$?: Subscription

  constructor(
    private _subject: BehaviorSubject<TData | LoadingState>,
    _fetch: Observable<TData>,
    private _update: (patch: TData) => Observable<TData>,
    options = { lazyLoad: true }
  ) {
    this.data$ = _subject.asObservable().pipe(isLoaded())
    this.resolver$ =
      this.createDataResolver$(_subject, _fetch)

    if (options.lazyLoad) { this.tryActivateResolver() }
  }

}
