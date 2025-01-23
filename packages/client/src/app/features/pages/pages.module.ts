import { NgModule } from '@angular/core'
import { MaterialUIModule } from '../../core/modules/material.ui.module'
import { UIModule } from '../../core/modules/ui.module'
import { AuthModule } from './auth/auth.module'
import { DocumentChatPageModule } from './document-chat/document-chat.module'
import { FileManagerPageModule } from './file-manager/file-manager.module'
import { ResumeModule } from './resume/resume.module'
import { UserProfileModule } from './user-profile/user-profile.module'


const modules = [
  UIModule,
  MaterialUIModule,
  ResumeModule,
  UserProfileModule,
  AuthModule,
  FileManagerPageModule,
  DocumentChatPageModule
]
@NgModule({
  imports: modules,
  exports: modules
})
export class PagesModule { }
