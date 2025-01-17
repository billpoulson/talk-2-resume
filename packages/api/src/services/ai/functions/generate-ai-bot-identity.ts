import { OllamaService } from '@talk2resume/common'
import { Subject } from 'rxjs'

export async function generateAIBotIdentity(
  prompt: OllamaService,
  aiName: Subject<string>) {
  let buffer = await prompt.generate(
    'invent a name, Please provide your response in ONLY valid JSON format, DO NOT include conversational text ,\r,\n:  { name: string }')

  try {
    buffer = buffer.replace('\r', '').replace('\n', '')
    const aa = JSON.parse(buffer)
    aiName.next(aa.name)
  } catch (err) {
    aiName.next('AL')
  }
  return buffer
}