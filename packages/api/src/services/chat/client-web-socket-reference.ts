import { inject, injectable } from 'tsyringe'
import { WSTOKEN_SEND_FN$$ } from '../../ioc/injection-tokens'

@injectable()
export class ClientWebsocketReference {
    constructor(
        @inject(WSTOKEN_SEND_FN$$) public send: (message: any) => void,
    ) { }
}