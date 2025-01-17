import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { newUUID } from '@talk2resume/common'
import { firstValueFrom, tap } from 'rxjs'
import { AuthroizedWebSocketService } from '../../../../core/services/sockets/authorized-web-socket.service'
import { SetUserNameDialogComponent } from '../../text-chat/set-user-name-dialog/set-user-name-dialog.component'


@Component({
  selector: 'app-connect-webservice-button',
  standalone: false,
  template: `
    <button mat-stroked-button color="primary" (click)="toggleConnection()" >
      <mat-icon>{{getIcon()}}</mat-icon> {{ getText() }}
    </button>
  `,
  styleUrls: ['./connect-webservice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectWebServiceButtonComponent implements AfterViewInit {
  isConnected = false;
  static USERNAME = ''
  public get name() { return ConnectWebServiceButtonComponent.USERNAME }
  public set name(value) { ConnectWebServiceButtonComponent.USERNAME = value }

  @Input() public autoConnect = false
  constructor(
    public socket: AuthroizedWebSocketService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {

    socket.connectionStatus$
      .pipe(tap(st => {
        this.isConnected = st
        this.cdr.markForCheck()
      })).subscribe()

  }
  async ngAfterViewInit(): Promise<void> {
    if (this.autoConnect) {
      const isConnected = await (firstValueFrom(this.socket.connectionStatus$))
      if (!isConnected) {
        this.toggleConnection()
      }
    }
  }

  toggleConnection = async () => {

    await this.ensureUsernameIsProvided()
    const isConnected = await (firstValueFrom(this.socket.connectionStatus$))

    if (!isConnected) {
      this.socket.connect(this.name, 5000)
    } else {
      this.socket.disconnect()
    }

  }

  getText = () => this.isConnected ? 'Disconnect' : 'Connect'
  getIcon = () => this.isConnected ? 'pause' : 'play_arrow'

  private async ensureUsernameIsProvided() {
    if (this.name?.length == 0) {
      this.name = newUUID() ?? await this.acquireUsername()
    }
  }

  private async acquireUsername(): Promise<string> {
    return await firstValueFrom(
      this.dialog.open(
        SetUserNameDialogComponent, {
        data: {},
      }).afterClosed())
  }
}

