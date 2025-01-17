import { ConnectionAuthorizationData } from '@talk2resume/types'
import { injectable } from 'tsyringe'
import { ClientWebsocketReference } from '../../../chat/client-web-socket-reference'


@injectable()
export class BlockStatusEmitter {
    constructor(
        public connection: ConnectionAuthorizationData,
        { send }: ClientWebsocketReference
    ) {
        // interval(1000)
        //     .pipe(
        //         startWith(0),
        //         tap(x => {
        //             send({
        //                 type: 'open-blocks',
        //                 data: { openBlocks: x }
        //             })
        //         })).subscribe()
    }
}
