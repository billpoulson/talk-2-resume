import { Injectable } from '@angular/core'
import { completeSubject, ConnectionState, forwardTo } from '@talk2resume/common'
import { P2PServiceMessageWrapper, WebRTC_ICE_Request, WebRTCConnectionAnswer, WebRTCConnectionOffer } from '@talk2resume/types'
import { BehaviorSubject, map, merge, Subject, takeUntil, tap } from 'rxjs'
import { AppMessageQueue, createWrappedMessage } from '../../../../core/mq/app-message-queue'


@Injectable({ providedIn: "root" })
export class P2PStreamConnectionService {

  localStream: MediaStream | null = null;
  public remoteStream: MediaStream = new MediaStream();

  connectionMap: Record<string, string> = {
    [ConnectionState.Connected + CallType.Initiator]: 'CONNECTED:INITIATED CALL',
    [ConnectionState.Connected + CallType.Receiver]: 'CONNECTED:RECEIVED CALL',
  };

  private _peerConnection!: RTCPeerConnection
  public get peerConnection(): RTCPeerConnection {
    if (!this._peerConnection || ["closed", "disconnected", "failed"].includes(this._peerConnection.connectionState)) {
      this._peerConnection = this.createNewPeerConnection()
    }
    return this._peerConnection
  }


  public statusMessage$ = new BehaviorSubject<string>('');
  public callStatus$ = new BehaviorSubject<{ call: ConnectionState; type: CallType }>({ call: ConnectionState.Idle, type: CallType.Idle });
  private P2PServiceTunnel: { send: (data: WebRTC_ICE_Request | WebRTCConnectionOffer | WebRTCConnectionAnswer) => void }
  private destroy$ = new Subject<void>;

  constructor(
    private mq: AppMessageQueue
  ) {

    this.P2PServiceTunnel = this.mq.createTypedMessageInterface(P2PServiceMessageWrapper)

    merge(
      this.createStatusMessageStream$(),
      this.listenForWebRtcHandshake$()
    ).pipe(takeUntil(this.destroy$)).subscribe()

  }

  private createStatusMessageStream$() {
    return this.callStatus$
      .pipe(
        map(({ call, type }) => this.connectionMap?.[call + type] ?? ''),
        forwardTo(this.statusMessage$)
      )
  }

  private listenForWebRtcHandshake$() {
    return merge(
      this.mq.selectTypedMessage(WebRTC_ICE_Request)
        .pipe(tap(async (data) => {
          if (data.candidate) {
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(data))
          }
        })),
      this.mq.selectTypedMessage(WebRTCConnectionAnswer)
        .pipe(tap(async (data) => {
          this.callStatus$.next({
            call: ConnectionState.Connected,
            type: CallType.Initiator
          })

          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data))
        })),
      this.mq.selectTypedMessage(WebRTCConnectionOffer)
        .pipe(tap(async (data) => {
          this.callStatus$.next({
            call: ConnectionState.Connected,
            type: CallType.Receiver
          })
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data))
          const answer = await this.peerConnection.createAnswer()
          await this.peerConnection.setLocalDescription(answer)
          this.P2PServiceTunnel.send(createWrappedMessage(WebRTCConnectionAnswer, answer))

        }))
    )
  }

  async init() {
    await this.startLocalStream()
  }

  async startLocalStream() {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: true
    })

    this.localStream.getTracks()
      .forEach((track) => {
        this.peerConnection.addTrack(track, this.localStream!)
      })
  }

  async createOffer() {
    const peerConnection = this.peerConnection
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    this.P2PServiceTunnel.send(createWrappedMessage(WebRTCConnectionOffer, offer))
  }

  async endStream() {
    this.callStatus$.next({
      ...this.callStatus$.value,
      call: ConnectionState.Idle,
    })
    this.peerConnection.close()
  }

  dispose(): void {
    completeSubject(this.destroy$)
  }

  createNewPeerConnection() {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    })

    peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE Connection State:', peerConnection.iceConnectionState)

      if (peerConnection.iceConnectionState === 'disconnected') {
        this.callStatus$.next({
          ...this.callStatus$.value,
          call: ConnectionState.Idle,
        })
        console.log('The peer has disconnected.')
      } else if (peerConnection.iceConnectionState === 'failed') {
        console.log('The ICE connection has failed.')
      } else if (peerConnection.iceConnectionState === 'closed') {
        this.callStatus$.next({
          ...this.callStatus$.value,
          call: ConnectionState.Idle,
        })
        console.log('The connection has been closed.')
      }
    }

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.P2PServiceTunnel.send(createWrappedMessage(WebRTC_ICE_Request, event.candidate))
      }
    }

    peerConnection.ontrack = (event) => {
      this.remoteStream.addTrack(event.track)
    }
    return peerConnection
  }


}

export enum CallType {
  Idle = "IDLE",
  Initiator = "INITIATOR",
  Receiver = "RECEIVER"
}


