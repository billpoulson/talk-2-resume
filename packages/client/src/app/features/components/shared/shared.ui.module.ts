import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AgGridAngular } from 'ag-grid-angular'

import { MaterialUIModule } from '../../../core/modules/material.ui.module'
import { AccelerationCurveComponent } from './acceleration-curve/acceleration-curve.component'
import { AppLoadingSpinnerComponent } from './app-loading-spinner/app-loading-spinner.component'
import { CardActionsExampleContent } from './card-example-content/card-example.component'
import { ConnectWebServiceButtonComponent } from './connect-webservice-button/connect-webservice.component'
import { CurrentUsernameComponent } from './current-username/current-username.component'
import { FileUploadComponent } from './file-upload/file-upload.component'
import { LogOutButtonComponent } from './log-out-button/log-out-button.component'
import { TypographyComponent } from './primitive/typography/typography.component'
import { StartFakeRequestButtonComponent } from './start-fake-request-button/start-fake-request-button.component'
import { TextRangeSelectComponent } from './text-range-select/text-range-select.component'
import { UploadProgressBarComponent } from './upload-progress-bar/upload-progress-bar.component'
import { UserProfileComponent } from './user-profile/callback.component'

const sharedComponents = [
  CardActionsExampleContent,
  TypographyComponent,
  UserProfileComponent,
  ConnectWebServiceButtonComponent,
  AccelerationCurveComponent,
  CurrentUsernameComponent,
  AppLoadingSpinnerComponent,
  StartFakeRequestButtonComponent,
  LogOutButtonComponent,
  FileUploadComponent,
  UploadProgressBarComponent,
  TextRangeSelectComponent
]

@NgModule({
  imports: [
    CommonModule,
    AgGridAngular,
    MaterialUIModule,
    RouterModule,
  ],
  declarations: sharedComponents,
  exports: [...sharedComponents],
  providers: [UploadProgressBarComponent]
})
export class SharedUIComponentsModule { }

