import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, finalize } from 'rxjs'
import { UploadProgressService } from '../../core/services/uploads'
import { LoadingStatusService } from '../components/shared/app-loading-spinner/loading-status.service'

export type UploadProgressMessage = {
  isChunkedUpload: boolean
  key: string
  name: string
  progress: number
  complete: boolean
  data_progress: string
  complete_timestamp: number
  cancellationToken: string
  cancelled: boolean,
  meta: {
    group: string
    chunkSize: number
    chunkCount: number
    chunkNumber: number
    chunkIndex: number
  }
}

@Injectable()
export class FileUploadInterceptor implements HttpInterceptor {
  constructor(
    private uploadProgress: UploadProgressService,
    private loadingService: LoadingStatusService
  ) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler

  ): Observable<HttpEvent<unknown>> {
    if (request.method === 'OPTIONS') { return next.handle(request) }
    const chunkedPayloadProgress = this.getChunkedUploadData(request)
    const { isChunkedUpload, key } = chunkedPayloadProgress

    if (!isChunkedUpload) { return next.handle(request) }

    const isLastChunk: boolean = this.uploadProgress.setProgress(chunkedPayloadProgress)

    this.loadingService.show(key)
    return next.handle(request)
      .pipe(
        finalize(() => {
          if (isLastChunk) {
            this.loadingService.hide(key)
          }
        })
      )
  }

  private getChunkedUploadData(
    request: HttpRequest<any>
  ): UploadProgressMessage {

    const isChunkedUpload = Boolean(request.headers.get('chunked-upload'))
    const fileName = request.headers.get('chunked-upload_file') ?? ''
    const cancellationToken = request.headers.get('chunked-upload_cancellationToken') ?? ''
    const group = request.headers.get('chunked-upload_group') ?? ''
    const chunkSize = Number(request.headers.get('chunked-upload_chunk-size'))
    const chunkNumber = Number(request.headers.get('chunked-upload_chunk-index'))
    const chunkIndex = Number(request.headers.get('chunked-upload_chunk-index')) + 1
    const chunkCount = Number(request.headers.get('chunked-upload_chunk-count'))

    const compositeKey = [request.url, group, fileName].join('+')
    const encodedKey = btoa(compositeKey)
    const progress = (chunkIndex / chunkCount) * 100
    
    const meta = {
      group,
      chunkCount,
      chunkIndex,
      chunkNumber,
      chunkSize
    }
    return {
      isChunkedUpload,
      complete_timestamp: +new Date,
      key: encodedKey,
      name: fileName,
      progress,
      complete: progress == 100,
      data_progress: this.getProgressString(chunkCount, chunkIndex, chunkSize),
      cancellationToken,
      cancelled: false,
      meta
    }
  }

  public getProgressString(
    chunkCount: number,
    chunkIndex: number,
    chunkSize: number
  ): string {
    // Calculate the total file size in bytes
    const totalSizeInBytes = chunkCount * chunkSize

    // Calculate the progress in bytes
    const uploadedSizeInBytes = chunkIndex * chunkSize

    // Format the uploaded size
    const uploadedSize = this.formatSize(uploadedSizeInBytes)

    // Format the total size
    const totalSize = this.formatSize(totalSizeInBytes)

    return `${uploadedSize}/${totalSize}`
  }

  private formatSize(sizeInBytes: number): string {
    if (sizeInBytes >= 1 * 1024 * 1024 * 1024) {
      // Convert to GB
      return `${(sizeInBytes / (1 * 1024 * 1024 * 1024)).toFixed(2)}GB`
    } else if (sizeInBytes >= 1 * 1024 * 1024) {
      // Convert to MB
      return `${(sizeInBytes / (1 * 1024 * 1024)).toFixed(2)}MB`
    } else if (sizeInBytes >= 1 * 1024) {
      // Convert to KB
      return `${(sizeInBytes / (1 * 1024)).toFixed(2)}KB`
    } else {
      // Bytes
      return `${sizeInBytes}B`
    }
  }
}


