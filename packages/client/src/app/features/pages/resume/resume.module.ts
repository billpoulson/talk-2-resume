import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { UIModule } from '../../../core/modules/ui.module'
import { ModalModule } from '../../components/modal/modal.module'
import { ResumePageComponent } from './resume/resume.component'
import { UploadTestComponent } from './upload-test/upload-test.component'


@NgModule({
  declarations: [
    ResumePageComponent,
    UploadTestComponent
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
