import { Routes } from '@angular/router'
import { AuthGuard } from '@auth0/auth0-angular'
import { LogOutComponent } from './features/pages/auth/log-out/log-out.component'
import { LoggedOutComponent } from './features/pages/auth/logged-out/logged-out.component'
import { DocumentChatComponent } from './features/pages/document-chat/document-chat.component'
import { FileManagerPageComponent } from './features/pages/file-manager/file-manager.component'
import { ResumePageComponent } from './features/pages/resume/resume.component'
import { UserProfileComponent } from './features/pages/user-profile/user-profile.component'
export const routes: Routes = [
  {
    path: 'dashboard',
    component: ResumePageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-files',
    component: FileManagerPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'text-range',
    component: DocumentChatComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'log-out',
    component: LogOutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'logged-out',
    component: LoggedOutComponent,
  },
  {
    path: '',
    component: ResumePageComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'login' },
]
