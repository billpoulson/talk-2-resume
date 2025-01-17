import { Injectable } from "injection-js";

@Injectable()
export class AppConfig {
  public port = process.env?.["PORT"] || 8080;
}
