import { Injectable } from '@angular/core'
import { AbstractLogger, LogLevel } from '@talk2resume/common'
import loglevel from 'loglevel'

@Injectable({
    providedIn: 'root',
})
export class LoglevelLogger extends AbstractLogger {
    private logger: loglevel.Logger

    constructor() {
        super()
        this.logger = loglevel
        this.logger.setLevel('debug')
    }

    log(level: LogLevel, message: string, ...args: any[]): void {
        (this.logger as any)[level](message, ...args)
    }
}
