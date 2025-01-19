import { Injectable } from '@angular/core'
import { Dictionary } from '@talk2resume/types'
import { BehaviorSubject, map, Observable, withLatestFrom } from 'rxjs'
import { UploadProgressMessage } from '../../features/interceptors/file-upload.interceptor'

@Injectable({
  providedIn: 'root'
})
export class UploadProgressService {
  private _state = new BehaviorSubject<Dictionary<UploadProgressMessage>>({})
  progress$: Observable<UploadProgressMessage[]>
  constructor(
    public uploadCancelService: UploadCancellationService,
  ) {
    this.progress$ = this.createProgressSubject$()
  }

  createProgressSubject$() {
    return this._state
      .pipe(
        withLatestFrom(this.uploadCancelService.subscribeToCancellation$()),
        map(([state, cancellations]) => Object.values(state)
          .map(record => ({ ...record, cancelled: cancellations.indexOf(record.cancellationToken) > -1 }) as UploadProgressMessage)
          .filter(state => {

            if (state.complete_timestamp === undefined) { return true }
            // get the current time in seconds
            const currentTimestamp = Math.floor(+new Date / 1000)  // convert from ms to sec
            // convert the item's timestamp to seconds
            const itemTimestamp = Math.floor(state.complete_timestamp / 1000)  // convert from ms to sec

            // find the difference
            const difference = currentTimestamp - itemTimestamp
            // keep only items less than 10 seconds old
            return difference < 20
          })
        )
      )
  }

  setProgress(progress: UploadProgressMessage) {
    const currentChunkIndex = this._state.value?.[progress.key]?.meta.chunkIndex ?? 0
    if (progress.meta.chunkIndex > currentChunkIndex) {
      this._state.next({
        ...this._state.value,
        [progress.key]: progress
      })
    }

    return progress.complete
  }

}


@Injectable({
  providedIn: 'root'
})
export class UploadCancellationService {
  private _state = new BehaviorSubject<Dictionary<boolean>>({})

  isCancelled(cancellationToken: string) {
    return Object.keys(this._state.value).indexOf(cancellationToken) > -1
  }
  isCancelled$(cancellationToken: string) {
    return this.subscribeToCancellation$().pipe(map(z => z.indexOf(cancellationToken) > -1))
  }

  subscribeToCancellation$() {
    return this._state.pipe(map(cancelations => Object.keys(cancelations)))
  }

  cancel(cancellationToken: string) {
    this._state.next({
      ...this._state.value,
      [cancellationToken]: true
    })
  }

}
