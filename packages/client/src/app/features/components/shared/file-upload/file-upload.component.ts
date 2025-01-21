
import { Component, ElementRef, ViewChild } from '@angular/core'
import { AuthService } from '@auth0/auth0-angular'
import { FileUploadService } from '../../../../core/services/file-upload.service'

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  standalone: false
})
export class FileUploadComponent {
  uploadProgress: { file: string; progress: number; status: string }[] = [];
  @ViewChild('uploadInput') uploadInput!: ElementRef
  public fileCount = 0;
  constructor(
    private fileUploadService: FileUploadService,
    public authService: AuthService
  ) { }

  async onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files) {
      this.fileCount = Array.from(input.files).length
    }
  }

  async beginUpload() { 
    const files = this.getSelectedFiles()
    if (files.length > 0) {
      this.fileUploadService.uploadFiles(files, '/api/uploads/upload')
        .subscribe(progress => {
          this.uploadProgress = progress
        })
    }
  }

  getSelectedFiles() {
    const input = this.uploadInput.nativeElement as HTMLInputElement
    if (input.files) {
      return Array.from(input.files) // Convert FileList to an array
    }
    return []
  }
}