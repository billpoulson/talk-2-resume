import { OllamaService } from '@talk2resume/common'
import { concatMap, firstValueFrom, from, map, mergeAll, toArray } from 'rxjs'
import { injectable } from 'tsyringe'

@injectable()
export class OllamaEmbeddingFunction {

  constructor(
    private ollama: OllamaService,
  ) {
  }

  public async generate(texts: string[]): Promise<number[][]> {
    try {
      return firstValueFrom(
        from(texts)
          .pipe(
            concatMap(chunk => from(this.ollama.embed(chunk))),
            map(data => data.embeddings),
            toArray(),
            mergeAll()
          )
      )
    } catch (error) {
      console.error("Error fetching embeddings from Ollama:", error)
      throw new Error("Failed to generate embeddings.")
    }
  }
}
