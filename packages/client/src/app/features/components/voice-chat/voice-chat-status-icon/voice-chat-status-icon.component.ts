import { ChangeDetectionStrategy, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { ConnectionState } from '@talk2resume/common';
import { map, Subject, takeUntil, tap } from 'rxjs';
import { VoiceChatComponent } from '../voice-chat/voice-chat.component';

@Component({
  selector: 'app-voice-chat-status',
  standalone: false,

  templateUrl: './voice-chat-status-icon.component.html',
  styleUrl: './voice-chat-status-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class VoiceChatStatusComponent implements OnInit, OnDestroy {
  colorMap: Record<string, string> = {
    [ConnectionState.Connected]: 'status-0',
    [ConnectionState.Connecting]: 'status-1',
    [ConnectionState.Error]: 'status-2',
    [ConnectionState.Idle]: 'status-3'
  };
  destroy$ = new Subject<void>
  @HostBinding('class') hostClass: string = '';
  @Input() connectionRef!: VoiceChatComponent

  ngOnInit(): void {
    this.connectionRef
      .viewState$()
      .pipe(
        takeUntil(this.destroy$),
        map(v => this.colorMap[v.status.call]),
        tap(x => {
          this.hostClass = x
        })
      ).subscribe()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
  }
}
