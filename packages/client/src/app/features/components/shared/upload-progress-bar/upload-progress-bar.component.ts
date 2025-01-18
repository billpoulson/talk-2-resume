import { Component, Input, OnInit } from '@angular/core'
import { UploadProgressService } from '../../../../core/services/uploads'

@Component({
  selector: 'app-upload-progress-bar',
  standalone: false,
  templateUrl: './upload-progress-bar.component.html',
  styleUrl: './upload-progress-bar.component.scss'
})
export class UploadProgressBarComponent implements OnInit {
  progress: { name: string, progress: number } = { name: 'test', progress: 50 }
  @Input() inputKey = ''

  constructor(private uploadService: UploadProgressService) {
  }
  ngOnInit(): void {
    // this.uploadService.subscribeToProgress$(this.inputKey).subscribe(v => {
    //   // this.progress = v
    // })
  }
}

