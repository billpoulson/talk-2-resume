import { Component, Input } from '@angular/core'
import { createComponentBem } from '../../../../../core/util/bem'

@Component({
  selector: 'app-channel-list-item',
  standalone: false,

  templateUrl: './channel-list-item.component.html',
  styleUrl: './channel-list-item.component.scss'
})
export class ChannelListItemComponent {
  bem = createComponentBem('channel-list-item')
  @Input() data: any = {}
}
