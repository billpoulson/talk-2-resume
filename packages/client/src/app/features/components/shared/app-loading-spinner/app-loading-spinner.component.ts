import { Component, HostBinding, Input } from '@angular/core'
import { Observable } from 'rxjs'
import { DEFAULT_LOADING_CONTEXT, LoadingStatusService } from './loading-status.service'

@Component({
  selector: 'app-loading-spinner',
  standalone: false,
  templateUrl: './app-loading-spinner.component.html',
  styleUrls: ['./app-loading-spinner.component.scss']
})
export class AppLoadingSpinnerComponent {
  @Input() context: string = DEFAULT_LOADING_CONTEXT;
  @HostBinding('class.global') classGlobal: boolean = true;
  isLoading!: Observable<boolean>
  constructor(
    private ux: LoadingStatusService
  ) {
    this.classGlobal = this.context === DEFAULT_LOADING_CONTEXT
    this.isLoading = this.ux.createIsLoading$(this.context)
  }
}
