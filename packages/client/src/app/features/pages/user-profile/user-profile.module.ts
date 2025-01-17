import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { UIModule } from '../../../core/modules/ui.module'
import { ModalModule } from '../../components/modal/modal.module'
import { UserProfileComponent } from './user-profile.component'


@NgModule({
  declarations: [
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    ModalModule,
  ]
})
export class UserProfileModule { }
