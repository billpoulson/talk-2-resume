import { Location } from '@angular/common'
import { Directive, HostListener } from '@angular/core'
import { Router } from '@angular/router'

@Directive({
  selector: '[appGoBack]'
})
export class GoBackDirective {

  constructor(
    private location: Location,
    private roter: Router
  ) { }

  @HostListener('click')
  onClick(): void {
    if (window.history.state?.navigationId > 2) { this.location.back() }
    else { this.roter.navigateByUrl('/dashboard') }
  }
}
