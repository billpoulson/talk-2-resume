import { UserInfoObject } from '@talk2resume/types'
import { injectable } from 'tsyringe'

@injectable()
export class HangarRepo {
  constructor(
    private profile: UserInfoObject,
  ) {
  }
}
