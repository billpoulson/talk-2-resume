import { Injectable } from '@angular/core'
import { Dictionary } from '@talk2resume/types'
import { BehaviorSubject, finalize, map, withLatestFrom } from 'rxjs'
import { LoadingStatusService } from '../../features/components/shared/app-loading-spinner/loading-status.service'
import { UploadProgressMessage } from '../../features/interceptors/file-upload.interceptor'

@Injectable({
  providedIn: 'root'
})
export class UploadProgressService {
  statusSubject = new BehaviorSubject<Dictionary<UploadProgressMessage>>({})
  constructor(
    public uploadCancelService: UploadCancellationService,
    private loadingService: LoadingStatusService

  ) { }

  clearUploads() { this.statusSubject.next({}) }

  subscribeToProgress$() {
    return this.statusSubject
      .pipe(
        withLatestFrom(this.uploadCancelService.subscribeToCancellation$()),
        map(([state, cancellations]) => Object.values(state)
          .map(record => ({ ...record, cancelled: cancellations.indexOf(record.cancellationToken) > -1 }))
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
        ),
        finalize(() => { })
      )
  }

  setProgress(progress: UploadProgressMessage) {
    const currentChunkIndex = this.statusSubject.value?.[progress.key]?.meta.chunkIndex ?? 0
    if (progress.meta.chunkIndex > currentChunkIndex) {
      this.statusSubject.next({
        ...this.statusSubject.value,
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
  keys = new BehaviorSubject<Dictionary<boolean>>({})

  isCancelled(cancellationToken: string) {
    return Object.keys(this.keys.value).indexOf(cancellationToken) > -1
  }
  isCancelled$(cancellationToken: string) {
    return this.subscribeToCancellation$().pipe(map(z => z.indexOf(cancellationToken) > -1))
  }

  subscribeToCancellation$() {
    return this.keys.pipe(map(cancelations => Object.keys(cancelations)))
  }

  cancel(cancellationToken: string) {
    this.keys.next({
      ...this.keys.value,
      [cancellationToken]: true
    })
  }

}
