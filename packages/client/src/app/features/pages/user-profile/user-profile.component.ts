import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { first, firstValueFrom, shareReplay, timer } from 'rxjs'

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  onOptionClick(option: string): void {
    console.log(`You selected: ${option}`)
    // Perform additional actions here
  }

  /**
   *
   */
  constructor(
    private http: HttpClient,

  ) {
    this.start()
  }
  start() {
    timer(0)
      .pipe(first())
      .subscribe(async v => {
        await firstValueFrom(this.http.get('/api/_/await/60000').pipe(shareReplay(1)))
      })
  }
}
