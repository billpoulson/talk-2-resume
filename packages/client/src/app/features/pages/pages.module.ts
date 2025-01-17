import { NgModule } from '@angular/core'
import { AuthModule } from './auth/auth.module'
import { ResumeModule } from './resume/resume.module'
import { UserProfileModule } from './user-profile/user-profile.module'


const modules = [
  ResumeModule,
  UserProfileModule,
  AuthModule
]
@NgModule({
  imports: modules,
  exports: modules
})
export class PagesModule { }
