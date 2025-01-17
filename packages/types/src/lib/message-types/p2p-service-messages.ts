
export class WebRTCConnectionOffer {
  static type = 'webrtc/offer'
  constructor(
    public data: RTCSessionDescriptionInit
  ) {
  }
}

export class WebRTC_ICE_Request {
  static type = 'webrtc/ice';
  constructor(
    public data: RTCIceCandidate
  ) {
  }
}

export class WebRTCConnectionAnswer {
  static type = 'webrtc/answer';
  constructor(
    public data: RTCSessionDescriptionInit
  ) {
  }
}

export class P2PServiceMessageWrapper {
  static type = 'webrtc:container';
  constructor(
    public data: WebRTCConnectionOffer | WebRTC_ICE_Request | WebRTCConnectionAnswer
  ) {
  }
}
