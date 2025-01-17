import { ConnectionAuthorizationData } from '@talk2resume/types'
import { interval, tap } from 'rxjs'
import { injectable } from 'tsyringe'
import { ClientWebsocketReference } from '../../../chat/client-web-socket-reference'


@injectable()
export class ServerTimeEmitter {
    constructor(
        public connection: ConnectionAuthorizationData,
        public ws: ClientWebsocketReference
    ) {
        interval(10000)
            .pipe(
                tap(x => {
                    ws.send({ serverTime: + new Date() })
                }))
            .subscribe()
    }
}
