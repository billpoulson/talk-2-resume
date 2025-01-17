import { inject } from '@angular/core';
import { ServiceContext } from './core/service.context';

export function appInitFn() {
  inject(ServiceContext);// activate service context
}
