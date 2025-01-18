import { Component, effect, HostBinding, Input, Signal, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { UploadProgressMessage } from '../../../interceptors/file-upload.interceptor'
import { DEFAULT_LOADING_CONTEXT } from './loading-status.service'
import { UX } from './UX'

@Component({
  selector: 'app-loading-spinner',
  standalone: false,
  templateUrl: './app-loading-spinner.component.html',
  styleUrls: ['./app-loading-spinner.component.scss']
})
export class AppLoadingSpinnerComponent {
  @Input() context: string = DEFAULT_LOADING_CONTEXT;
  @HostBinding('class.global') classGlobal: boolean = true;

  hasNetworkActivity: Signal<boolean>
  loaders: Signal<Array<UploadProgressMessage>>
  isUploading = signal<boolean>(false)

  constructor(
    private ux: UX
  ) {
    this.classGlobal = this.context === DEFAULT_LOADING_CONTEXT
    this.hasNetworkActivity = toSignal(this.ux.createIsLoading$(this.context), { initialValue: false })
    this.loaders = toSignal(this.ux.subscribeToProgress$(), { initialValue: [] })

    effect(() => {
      const a = this.loaders()
      const hasUploads = a.filter(x => !x.complete || x.cancelled).length > 0
      this.isUploading.set(hasUploads)
    })
  }

  trackByRef(index: number, item: any): number {
    return item.key
  }

  cancelUpload(status: UploadProgressMessage) {
    this.ux.cancelUpload(status)
  }
}
