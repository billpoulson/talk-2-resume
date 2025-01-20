import log, { LogLevelDesc } from 'loglevel'

export class LoggingConfig {
  constructor(
    public name: string | undefined,
    public level: LogLevelDesc
  ) { }
}

export class ClientLogger {
  logger: log.Logger

  /**
   * Constructor to create a new logger instance.
   * @param name - The name of the logger (optional).
   * @param level - Default log level for the logger.
   */
  constructor(cfg: LoggingConfig) {
    this.logger = cfg.name ? log.getLogger(cfg.name) : log
    this.setLevel(cfg.level)
  }

  /**
   * Set the logging level dynamically.
   * @param level - The log level to set (e.g., 'info', 'warn').
   */
  public setLevel(level: LogLevelDesc): void {
    this.logger.setLevel(level)
  }

  /**
   * Log a trace message.
   * @param message - The message to log.
   * @param context - Optional additional context or metadata.
   */
  public trace(message: string, context?: Record<string, unknown>): void {
    this.logger.trace(this.formatMessage(message, context))
  }

  /**
   * Log a debug message.
   * @param message - The message to log.
   * @param context - Optional additional context or metadata.
   */
  public debug(message: string, context?: Record<string, unknown>): void {
    this.logger.debug(this.formatMessage(message, context))
  }

  /**
   * Log an info message.
   * @param message - The message to log.
   * @param context - Optional additional context or metadata.
   */
  public info(message: string, context?: Record<string, unknown>): void {
    this.logger.info(this.formatMessage(message, context))
  }

  /**
   * Log a warning message.
   * @param message - The message to log.
   * @param context - Optional additional context or metadata.
   */
  public warn(message: string, context?: Record<string, unknown>): void {
    this.logger.warn(this.formatMessage(message, context))
  }

  /**
   * Log an error message.
   * @param message - The message to log.
   * @param context - Optional additional context or metadata.
   */
  public error(message: string, context?: Record<string, unknown>): void {
    this.logger.error(this.formatMessage(message, context))
  }

  /**
   * Formats the log message with optional context.
   * @param message - The main log message.
   * @param context - Optional additional metadata to include.
   * @returns The formatted log message.
   */
  private formatMessage(message: string, context?: Record<string, unknown>): string {
    if (context) {
      return `${message} | Context: ${JSON.stringify(context)}`
    }
    return message
  }
}

