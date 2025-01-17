import { Component } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { AuthroizedWebSocketService } from '../../../../core/services/sockets/authorized-web-socket.service'
import { createComponentBem } from '../../../../core/util/bem'

@Component({
  selector: 'app-not-connected',
  templateUrl: './not-connected.component.html',
  styleUrl: './not-connected.component.scss',
  standalone: false
})
export class NotConnectedComponent {
  bem = createComponentBem('app-not-connected')
  reconnectCountdown$: BehaviorSubject<number>
  /**
   *
   */
  constructor(
    public chatService: AuthroizedWebSocketService,
  ) {
    this.reconnectCountdown$ = chatService.reconnectCountdown$
  }
}
