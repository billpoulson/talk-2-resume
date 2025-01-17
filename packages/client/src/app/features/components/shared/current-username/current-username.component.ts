import { Component } from '@angular/core'
import { AuthService } from '@auth0/auth0-angular'

@Component({
  selector: 'app-current-username',
  standalone: false,
  
  templateUrl: './current-username.component.html',
  styleUrl: './current-username.component.scss'
})
export class CurrentUsernameComponent {
/**
 *
 */
constructor(
    public authService: AuthService,
) {
}
}
