import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { UIModule } from '../../../core/modules/ui.module'
import { ModalModule } from '../../components/modal/modal.module'
import { ResumePageComponent } from './resume/resume.component'


@NgModule({
  declarations: [
    ResumePageComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    ModalModule,
    RouterModule,
  ],
  providers: [
    ResumePageComponent,
  ]
})
export class ResumeModule { }
