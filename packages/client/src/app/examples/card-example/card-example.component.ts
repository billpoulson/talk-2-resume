import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIModule } from '../../core/modules/ui.module';

/**
 * @title Card with actions alignment option
 */
@Component({
  selector: 'card-example',
  templateUrl: 'card-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UIModule]
})
export class CardActionsExample { }
