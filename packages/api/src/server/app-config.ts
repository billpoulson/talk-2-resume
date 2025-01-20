import { injectable } from 'tsyringe'

@injectable()
export class AppConfig {
  public port = process.env?.["PORT"] || 8080;
}
