
import { Component } from '@angular/core'
import { AuthService } from '@auth0/auth0-angular'
import { firstValueFrom } from 'rxjs'
import { FileUploadService } from '../../../../core/services/file-upload.service'

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  standalone: false
})
export class FileUploadComponent {
  uploadProgress: { file: string; progress: number; status: string }[] = [];

  constructor(
    private fileUploadService: FileUploadService,
    public authService: AuthService
  ) { }

  async onFilesSelected(event: Event) {
    const token = await firstValueFrom(this.authService.getAccessTokenSilently())
    const input = event.target as HTMLInputElement
    if (input.files) {
      const files = Array.from(input.files) // Convert FileList to an array
      this.fileUploadService.uploadFiles(token, files, '/api/uploads/upload')
        .subscribe(progress => {

          this.uploadProgress = progress
        })
    }
  }
}