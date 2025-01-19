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
    private ollamaService: OllamaService,
    private ragService: OllamaRAGService
  ) {

    let aiName = new Subject<string>()

    merge(
      from(generateAIBotIdentity(ollamaService, aiName)),
      // transfer message from user scope into shared chat service scope
      mq.selectTypedMessage(ClientChatMessage)
        .pipe(
          withLatestFrom(aiName),
          tap(([data]) => {
            this.addMessage({ role: "user", content: data.message })
          }),
          tap(async ([data, name]) => {
            await ragService.query(data.message)
              .then(message => {
                this.addMessage({ role: "assistant", content: message })
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

  addMessage(message: { role: string, content: string }) {
    this.ollamaService.historypush(message)
    this.ragService.addToConversationHistory(`role:\n${message.role}:\ncontent:\n${message.content}`)
  }
}


