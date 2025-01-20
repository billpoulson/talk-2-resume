import { HttpClient, HttpEventType } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { AuthService } from '@auth0/auth0-angular'
import { newUUID } from '@talk2resume/common'
import { forkJoin, Observable, of } from 'rxjs'
import { first, map, switchMap, withLatestFrom } from 'rxjs/operators'
import { UploadCancellationService } from './uploads'


@Injectable({
  providedIn: 'root',
})
export class FileUploadSettings {
  public readonly chunkSize = 1 * 1024 * 1024
}

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(
    private http: HttpClient,
    public authService: AuthService,
    public uploadCancelService: UploadCancellationService,
    public cfg: FileUploadSettings,
  ) { }

  uploadFiles(token: string, files: File[], uploadUrl: string): Observable<{ file: string; progress: number; status: string }[]> {
    const uploadGroupUUID = newUUID()

    const uploadFile = (file: File): Observable<{ file: string; progress: number; status: string }> => {
      const cancellationToken = newUUID()
      let nextChunkIndex = 0
      const totalChunks = Math.ceil(file.size / this.cfg.chunkSize)

      const uploadChunk = (start: number, chunkIndex: number): Observable<{ progress: number; status: string }> => {
        const end = Math.min(start + this.cfg.chunkSize, file.size)
        const chunk = file.slice(start, end)

        const formData = new FormData()
        formData.append('file', chunk, file.name)
        formData.append('chunkIndex', chunkIndex.toString())
        formData.append('totalChunks', totalChunks.toString())
        return this.http.post(uploadUrl, formData, {
          reportProgress: true,
          observe: 'events',
          headers: {
            ['chunked-upload']: 'true',
            ['chunked-upload_chunk-size']: `${this.cfg.chunkSize}`,
            ['chunked-upload_group']: uploadGroupUUID,
            ['chunked-upload_file']: file.name,
            ['chunked-upload_cancellationToken']: cancellationToken,
            ['chunked-upload_chunk-index']: `${nextChunkIndex++}`,
            ['chunked-upload_chunk-count']: `${totalChunks}`,
            Authorization: `Bearer ${token}`,
          }
        }).pipe(
          withLatestFrom(this.uploadCancelService.isCancelled$(cancellationToken)),
          map(([event, cancel]) => {
            if (cancel) { return { progress: 100, status: 'cancel' } }
            switch (event.type) {
              case HttpEventType.UploadProgress:
                const progress = Math.round((100 * (chunkIndex + event.loaded / (end - start))) / totalChunks)
                return { progress, status: 'uploading' }

              case HttpEventType.Response:
                return { progress: Math.round(((chunkIndex + 1) / totalChunks) * 100), status: 'complete' }

              default:
                return { progress: Math.round((chunkIndex / totalChunks) * 100), status: 'pending' }
            }
          }),
          first(({ status }) => ['complete', 'cancel'].indexOf(status) > -1)
        )
      }

      const uploadChunks = (index: number): Observable<{ progress: number; status: string }> => {
        if (index >= totalChunks) {
          return of({ progress: 100, status: 'complete' })
        }
        return uploadChunk(index * this.cfg.chunkSize, index)
          .pipe(
            switchMap((progress) => {
              if (progress.status == 'cancelled') {
                return of(progress)
              }
              return uploadChunks(index + 1)
            })
          )
      }

      return uploadChunks(0).pipe(
        map(progress => ({ file: file.name, ...progress }))
      )
    }

    // Upload all files in parallel using forkJoin
    const uploadObservables = files.map(file => uploadFile(file))
    return forkJoin(uploadObservables)
  }


}
