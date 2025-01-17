import { MQ, OllamaService, unixTimestamp } from '@talk2resume/common'
import { ClientChatMessage } from '@talk2resume/types'
import { from, merge, Subject, tap, withLatestFrom } from 'rxjs'
import { injectable } from 'tsyringe'
import { generateAIBotIdentity } from '../ai/functions/generate-ai-bot-identity'
import { OllamaRAGService } from '../ai/ollama-rag.service'
import { ChatServerService } from './chat-server-service'

@injectable()
export class UserSocketRAGChatPrompt {

  constructor(
    commsService: ChatServerService,
    mq: MQ,
    prompt: OllamaService,
    ragService: OllamaRAGService
  ) {

    let aiName = new Subject<string>()

    merge(
      from(generateAIBotIdentity(prompt, aiName)),
      // transfer message from user scope into shared chat service scope
      mq.selectTypedMessage(ClientChatMessage)
        .pipe(
          withLatestFrom(aiName),
          tap(([data]) => {
            prompt.history.push({ role: "user", content: data.message })
          }),
          tap(async ([data, name]) => {
            await ragService.query(data.message)
              .then(message => {
                prompt.history.push({ role: "assistant", content: message })
                commsService.stream.next({
                  ...data,
                  user: `RAG: ${name}`,
                  ...unixTimestamp(),
                  message: message
                })
              })
          }))
    ).subscribe()

  }
}


