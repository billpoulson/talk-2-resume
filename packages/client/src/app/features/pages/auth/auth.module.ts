import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { MaterialUIModule } from '../../../core/modules/material.ui.module'
import { LogOutComponent } from './log-out/log-out.component'
import { LoggedOutComponent } from './logged-out/logged-out.component'

const m = [
  LoggedOutComponent,
  LogOutComponent
]

@NgModule({
  declarations: m,
  imports: [
    CommonModule,
    MaterialUIModule,
    RouterModule
  ],
  exports: m
})
export class AuthModule { }
