import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * @title Card with actions alignment option
 */
@Component({
  selector: 'card-example-content',
  templateUrl: 'card-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class CardActionsExampleContent { }
