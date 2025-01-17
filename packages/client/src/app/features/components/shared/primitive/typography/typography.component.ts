import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-typography',
  template: `<ng-content></ng-content>`,
  styleUrl: './typography.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class TypographyComponent { }
