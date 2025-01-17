import { MQ, completeSubject } from '@talk2resume/common';
import { Subject } from 'rxjs';


export class SocketServiceConnection {
  public disconnectSignal$ = new Subject<void>;

  constructor(
    public connectionId: string,
    public socket: any,
    public peerMQ: MQ, // message queue from client to server
    public send: (message: any) => void
  ) { }
  disconnect() { completeSubject(this.disconnectSignal$) }
}
