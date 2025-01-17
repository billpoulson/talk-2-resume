import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core'
import { AuthService } from '@auth0/auth0-angular'
import { AppMessageQueue } from '../../../core/mq/app-message-queue'

@Component({
  selector: 'app-sandbox',
  standalone: false,
  templateUrl: './sandbox.component.html',
  styleUrl: './sandbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxPageComponent {
  @Input()
  blockCount = 0
  constructor(
    public authService: AuthService,
    public mq: AppMessageQueue,
    private cdr: ChangeDetectorRef
  ) {

    mq.select<{ data: { openBlocks: number } }>('open-blocks')
      .subscribe(({ data: { openBlocks } }) => {
        this.blockCount = openBlocks
        this.cdr.markForCheck()
      })
  }

  ngOnInit(): void {

  }
}
