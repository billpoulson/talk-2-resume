
export class ChatUserData {
    constructor(
        public connectionId: string,
        public user: string,
        public ws: any,
        public send: (message: any) => void,
        public channelSubscriptions: Array<string>,
    ) {
    }

    isSubscribedToMessage({ channel }: { channel: string }) {
        return this.channelSubscriptions.includes(channel)
    }
};

;


