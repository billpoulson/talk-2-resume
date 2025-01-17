import { Ollama } from 'ollama'
import { injectable } from 'tsyringe'
import { OllamaServiceSettings } from './ollama.service.settings'
type ConversationHistoryEntry = { role: string, content: string }
@injectable()
export class OllamaService {
  history: Array<ConversationHistoryEntry> = []

  constructor(
    private settings: OllamaServiceSettings,
    private ollama: Ollama
  ) {
  
  }

  setHistory(
    history: { role: string; content: string }[],
  ) {
    this.history = history
  }

  // Generate a response while maintaining conversation history
  async chat() {
    if (this.history.length > 100) { this.history.shift() }
    return this.ollama.chat({
      model: this.settings.completionModel,
      messages: this.history,
    })
  }

  // Generate a simple response
  async generate(
    prompt: string
  ) {
    const { response } = await this.ollama.generate({
      model: this.settings.completionModel,
      prompt,
    })
    return response
  }

  // Generate embeddings from a prompt
  async embed(
    input: string
  ) {
    const response = await this.ollama.embed({
      model: this.settings.embeddingModel,
      input,
    })
    return response
  }

}
