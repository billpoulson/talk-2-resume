import { AbstractLogger, LogLevel } from '@talk2resume/common'
import { injectable } from 'tsyringe'
import winston from 'winston'

@injectable()
export class WinstonLogger extends AbstractLogger {
  private logger: winston.Logger

  constructor() {
    super()
    const isProduction = process.env['NODE_ENV'] == 'production'
    const level = isProduction ? 'info' : 'debug'

    this.logger = winston.createLogger({
      level,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`
        })
      ),
      transports: [new winston.transports.Console()]
    })
  }

  log(level: LogLevel, message: string, ...args: any[]): void {
    this.logger.log(level, message, ...args)
  }
}

@injectable()
export class ClientScopedLog extends WinstonLogger { }