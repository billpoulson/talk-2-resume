import { ChromaDbEmbeddingSettings, OllamaServiceSettings } from '@talk2resume/common'
import { ChromaClient } from 'chromadb'
import { Ollama } from 'ollama'
import { DependencyContainer } from 'tsyringe'


export function registerOllamaBackendForRoot(
    scope: DependencyContainer
): DependencyContainer {
    return scope
        .registerSingleton(OllamaServiceSettings)
        .register(OllamaServiceSettings, { useValue: new OllamaServiceSettings(process.env['OLLAMA_BASEURL']!) })
        .registerSingleton(ChromaDbEmbeddingSettings)
        .register(ChromaDbEmbeddingSettings, { useValue: new ChromaDbEmbeddingSettings(500) })
        .registerSingleton(Ollama)
        .register(Ollama, {
            useFactory: (deps) => {
                const { baseUrl } = deps.resolve(OllamaServiceSettings)
                return new Ollama({
                    host: baseUrl
                })
            }
        })
        .registerSingleton(ChromaClient)
        .register(ChromaClient, {
            useFactory: () =>
                new ChromaClient({
                    path: process.env['CHROMA_DB_BASEURL']
                })
        })
}
