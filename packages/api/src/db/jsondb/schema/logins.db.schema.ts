import { getDbRef } from '../core/util'

export class LoginDBSchema {
  static create(path: string) {
    return getDbRef(['logins', path], this.defaultData)
  }
  static defaultData: LoginDBSchema = {
    message: [],
  }
  constructor(
    public message: Array<string>,
  ) {
  }
}

