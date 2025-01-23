import { NgModule } from '@angular/core'
import { MatBadgeModule } from '@angular/material/badge'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { MatMenuModule } from '@angular/material/menu'
import { MatProgressBarModule, } from '@angular/material/progress-bar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSliderModule } from '@angular/material/slider'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTabsModule } from '@angular/material/tabs'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTreeModule } from '@angular/material/tree'

const modules = [
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTreeModule,
  MatSliderModule
]

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialUIModule { }
