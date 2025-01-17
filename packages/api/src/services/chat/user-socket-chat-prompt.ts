import { forwardTo, MQ, OllamaService, unixTimestamp } from '@talk2resume/common'
import { ClientChatMessage, UserInfoObject } from '@talk2resume/types'
import { concatMap, from, map, merge, Subject, tap, withLatestFrom } from 'rxjs'
import { injectable } from 'tsyringe'
import { generateAIBotIdentity } from '../ai/functions/generate-ai-bot-identity'
import { ChatServerService } from './chat-server-service'

@injectable()
export class UserSocketChatPrompt {
  agentName$ = new Subject<string>()

  constructor(
    mq: MQ,
    userInfo: UserInfoObject,
    commsService: ChatServerService,
    prompt: OllamaService,
  ) {

    prompt.setHistory([
      { role: "user", content: `keep your messages concise` },
      { role: "user", content: `here is some data about me | ${JSON.stringify(userInfo)}` },
      { role: "user", content: 'the setting is a deep-space cyber-punk space-punk dialogue' },
      { role: "user", content: 'you are a gritty ai space pirate character with hositle intent toward' },
      { role: "user", content: 'you are an ai talking to a human' },
      { role: "user", content: 'i won 50 ship' },
      { role: "user", content: 'the total value of my ships is $500000' },
      { role: "assistant", content: 'i will do my best to estimate when information is not available, but i will let you know when i do' }
    ])

    merge(
      from(generateAIBotIdentity(prompt, this.agentName$)),
      // transfer message from user scope into shared chat service scope
      mq.selectTypedMessage(ClientChatMessage)
        .pipe(
          withLatestFrom(this.agentName$),
          tap(([data]) => {
            prompt.history.push({ role: "user", content: data.message })
          }),
          concatMap(async ([data, name]) =>
            from(prompt.chat())
              .pipe(
                map((response) => ({
                  ...data,
                  user: `assistant: ${name}`,
                  ...unixTimestamp(),
                  message: response.message.content
                })),
                tap((response) => {
                  prompt.history.push({ role: "assistant", content: response.message })
                }),
                forwardTo(commsService.stream)
              )
          )
        )
    ).subscribe()
  }
}
