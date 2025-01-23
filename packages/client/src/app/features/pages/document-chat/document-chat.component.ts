import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './document-chat.component.html',
  styleUrl: './document-chat.component.scss'
})
export class DocumentChatComponent {
  constructor(
    private http: HttpClient,
  ) {
  }
}
