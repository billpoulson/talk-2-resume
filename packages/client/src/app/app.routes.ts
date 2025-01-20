import { Routes } from '@angular/router'
import { AuthGuard } from '@auth0/auth0-angular'
import { LogOutComponent } from './features/pages/auth/log-out/log-out.component'
import { LoggedOutComponent } from './features/pages/auth/logged-out/logged-out.component'
import { ResumePageComponent } from './features/pages/resume/resume/resume.component'
import { UploadTestComponent } from './features/pages/resume/upload-test/upload-test.component'
import { UserProfileComponent } from './features/pages/user-profile/user-profile.component'
export const routes: Routes = [
  {
    path: 'dashboard',
    component: ResumePageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'upload',
    component: UploadTestComponent,
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
