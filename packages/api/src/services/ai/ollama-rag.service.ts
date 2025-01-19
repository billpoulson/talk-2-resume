import { ChromaDbEmbeddingSettings, isTruthy, newUUID, OllamaService } from '@talk2resume/common'
import { UserInfoObject } from '@talk2resume/types'
import { ChromaClient, Collection } from 'chromadb'

import fs from "fs"
import { BehaviorSubject, firstValueFrom } from 'rxjs'
import { injectable } from 'tsyringe'
import { OllamaEmbeddingFunction } from './embed/ollama-embedding-function'


@injectable()
export class OllamaRAGService {
  isLoaded$ = new BehaviorSubject<boolean>(false)
  collection!: Collection

  constructor(
    private ollama: OllamaService,
    private userProfile: UserInfoObject,
    private embedSettings: ChromaDbEmbeddingSettings,
    private embeddingFunction: OllamaEmbeddingFunction,
    private chroma: ChromaClient
  ) {
    this.listAllCollections(embeddingFunction)

    this.chroma.getOrCreateCollection({
      name: userProfile.email.replaceAll('@', ''),
      embeddingFunction,
      metadata: {
        "description": userProfile.email
      }
    }).then(collection => {
      this.collection = collection
      this.isLoaded$.next(true)
    })
  }

  private listAllCollections(embeddingFunction: OllamaEmbeddingFunction) {
    this.chroma.listCollections().then(names => {
      // const jj = ollama
      console.log(`all collections: ${names.join(', ')}`)
      names.forEach(name => {
        this.chroma.getCollection({
          name,
          embeddingFunction
        }).then(({ name, metadata }) => {
          console.log('name:', name)
          console.log('meta-data:', metadata)
        })
      })
    })
  }

  loadDocumentFromMemory(
    content: string
  ): string[] {
    const chunks: string[] = []

    for (let i = 0; i < content.length; i += this.embedSettings.documentChunkSize) {
      chunks.push(content.substring(i, i + this.embedSettings.documentChunkSize))
    }

    return chunks
  }

  async addToConversationHistory(
    content: string
  ) {
    await firstValueFrom(this.isLoaded$.pipe(isTruthy()))
    const docUUID = newUUID()
    const documentChunks = this.loadDocumentFromMemory(content)
    const documents = [...documentChunks]
    await this.persistDocumentChunks(docUUID, documents)

    const chunks: string[] = []

    for (let i = 0; i < content.length; i += this.embedSettings.documentChunkSize) {
      chunks.push(content.substring(i, i + this.embedSettings.documentChunkSize))
    }

    return chunks
  }

  loadDocument(
    filePath: string
  ): string[] {
    const content = fs.readFileSync(filePath, "utf8")
    const chunks: string[] = []

    // Split text into smaller chunks
    for (let i = 0; i < content.length; i += this.embedSettings.documentChunkSize) {
      chunks.push(content.substring(i, i + this.embedSettings.documentChunkSize))
    }

    return chunks
  }

  private async persistDocumentChunks(
    documentUUID: string,
    chunks: string[]
  ) {
    for (const [index, content] of chunks.entries()) {
      await this.createNewDocument(content, documentUUID, index)
    }
  }

  private async queryChroma(query: string): Promise<string[]> {
    const queryEmbeddings = await this.embeddingFunction.generate([query])
    const results = await this.collection.query({
      queryEmbeddings,
      where: { ["owner"]: this.userProfile.sub },
      nResults: 5,

    })

    return results.documents.map((meta: any) => {
      return meta
    }).reduce((access, curr) => ([...access, curr]), [])
  }

  private async generateResponse(query: string, context: string[]): Promise<string> {
    const prompt = `Context:\n${context.join('\n\n')}\n\nQuery: ${query}`
    const buffer = await this.ollama.generate(prompt)
    return buffer
  }

  async loadSampleDocument(documentPath: string = "./document.txt") {
    await firstValueFrom(this.isLoaded$.pipe(isTruthy()))
    const docUUID = newUUID()
    const documentChunks = this.loadDocument(documentPath)
    const documents = [...documentChunks]
    await this.persistDocumentChunks(docUUID, documents)
  }

  async query(q: string) {
    const context = await this.queryChroma(q)
    return this.generateResponse(q, context)
  }

  private async createNewDocument(content: string, docUUID: string, index: number) {
    await this.collection.add({
      ids: [this.formatId(docUUID, index)],
      documents: [content],
      metadatas: [{
        document: docUUID,
        chunk: index,
        owner: this.userProfile.sub,
      }],
    })
  }

  private formatId(docUUID: string, index: number): string {
    return `${docUUID}-${index}`
  }
}

@injectable()
export class OllamaRAGScope {

  constructor(
    private userProfile: UserInfoObject,
    private rag: OllamaRAGService,
  ) {
    
  }
}

