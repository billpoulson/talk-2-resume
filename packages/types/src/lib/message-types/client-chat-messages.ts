import { Dictionary } from '../data'

export type ClientChatMessageSenderFragment = {
  user: string
  connectionId: string,
}
export type ClientChatMessageData = {
  isSender: boolean
  channel: string
  user: string
  connectionId: string,
  message: string
  timestamp: number
}
export class ClientChatMessage {
  static type = 'client-chat-message';
  constructor(public data: ClientChatMessageData) {
  }
}
export class SetUsernameMessage {
  static type = 'set-user-name';
  constructor(public data: string) {
  }
}


export type ChannelsAnnounceMessageData = {
  channels: string[]
}
export class ChannelsAnnounceMessage {
  static type = '';
  constructor(public data: ChannelsAnnounceMessageData) {
  }
}


export type SetUsernameErrorData = {
  message: string
}
export class SetUsernameError {
  static type = 'set-user-name/error';
  constructor(public data: SetUsernameErrorData) {
  }
}



export type SetUsernameSuccessData = {
  message: string
}
export class SetUsernameSuccess {
  static type = 'set-user-name/success';
  constructor(public data: SetUsernameSuccessData) {
  }
}


export class PushChannelUsersMessage {
  static type: string
  constructor(public data: Dictionary<Array<string>>) {
  }
}
