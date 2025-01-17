import { HttpClient } from '@angular/common/http'
import { Component, Input } from '@angular/core'
import { first, firstValueFrom, shareReplay, timer } from 'rxjs'

@Component({
  selector: 'app-start-fake-request-button',
  standalone: false,

  templateUrl: './start-fake-request-button.component.html',
  styleUrl: './start-fake-request-button.component.scss'
})
export class StartFakeRequestButtonComponent {
  @Input() icon: string = 'refresh'
  @Input() text: string = 'Begin'
  @Input() duration: string = '10000'
  constructor(
    private http: HttpClient,
  ) { }
  start() {
    timer(0)
      .pipe(first())
      .subscribe(async v => {
        await firstValueFrom(this.http.get(`/api/_/await/${this.duration}`).pipe(shareReplay(1)))
      })
  }
}
