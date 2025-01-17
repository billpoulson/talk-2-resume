import { Component } from '@angular/core'
import { AuthService } from '@auth0/auth0-angular'

@Component({
  selector: 'app-log-out',
  standalone: false,
  templateUrl: './log-out.component.html',
  styleUrl: './log-out.component.scss'
})
export class LogOutComponent {
  constructor(
    public authService: AuthService,
  ) {
  }

  async ngOnInit() {
    this.authService.logout({
      logoutParams: {
        returnTo: window.location.origin + '/logged-out', // Redirect URL after logout
      },
    })
  }
}
