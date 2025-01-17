import { ComponentType } from '@angular/cdk/portal'
import { Location } from '@angular/common'; // Ensure correct import
import { Component, Input, OnInit } from '@angular/core'
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { first, take } from 'rxjs'

@Component({
  selector: 'app-abstract-modal-loader',
  standalone: false,
  template: '',
  styles: ''
})
export abstract class ModalActivator<TData = any> implements OnInit {
  abstract activate(data?: TData, configOverrides?: Partial<MatDialogConfig<TData>>): void
  @Input() activatedByRoute = true
  constructor(
    private location: Location,
    public router: Router,
    public route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.data
      .pipe(
        take(1),
      )
      .subscribe(({
        data,
        config
      }) => {
        if (this.activatedByRoute)
          this.activate(data, config) // Error if abstractMethod is not implemented in a derived class
      })
  }

  launchDialog<T, D = any, R = any>(
    component: ComponentType<T>,
    data?: D,
    configOverrides?: Partial<MatDialogConfig<D>>
  ): MatDialogRef<T, R> {
    const defaultConfig: MatDialogConfig<D> = {
      width: '600px', // Default width
      disableClose: true, // Allow closing the dialog by clicking outside
      autoFocus: false, // Autofocus the first input
      data, // Pass in the provided data
    }
    const config = { ...defaultConfig, ...configOverrides }
    const dialogRef = this.dialog.open(component, config)
    dialogRef.afterClosed()
      .pipe(first())
      .subscribe((value => {
        if (this.activatedByRoute) {
          window.history.replaceState({}, '', null)
          if (window.history.state?.navigationId > 2) {
            this.location.back()
          }
          else {
            this.router.navigateByUrl('/dashboard')
          }
        }
      }))
    return dialogRef
  }
}
