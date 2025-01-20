// Define a common interface for logging
export interface Logger {
    log(level: LogLevel, message: string, ...args: any[]): void
    debug(message: string, ...args: any[]): void
    info(message: string, ...args: any[]): void
    warn(message: string, ...args: any[]): void
    error(message: string, ...args: any[]): void
}

// Define the log levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

// Abstract implementation
export abstract class AbstractLogger implements Logger {
    abstract log(level: LogLevel, message: string, ...args: any[]): void

    debug(message: string, ...args: any[]): void {
        this.log('debug', message, ...args)
    }

    info(message: string, ...args: any[]): void {
        this.log('info', message, ...args)
    }

    warn(message: string, ...args: any[]): void {
        this.log('warn', message, ...args)
    }

    error(message: string, ...args: any[]): void {
        this.log('error', message, ...args)
    }
}