import { OllamaService } from './ollama.service'

const documents = [
  "Llamas are members of the camelid family meaning they're pretty closely related to vicuñas and camels",
  "Llamas were first domesticated and used as pack animals 4,000 to 5,000 years ago in the Peruvian highlands",
  "Llamas can grow as much as 6 feet tall though the average llama is between 5 feet 6 inches and 5 feet 9 inches tall",
  "Llamas weigh between 280 and 450 pounds and can carry 25 to 30 percent of their body weight",
  "Llamas are vegetarians and have very efficient digestive systems",
  "Llamas live to be about 20 years old, though some only live for 15 years and others live to be 30 years old",
]
class aaa {
  /**
   *
   */
  constructor(
    private s: OllamaService
  ) {
  }
  async doStuff() {
    const collection: { id: string; embedding: number[]; document: string }[] = []

    // Store each document in a vector embedding database
    for (const [i, doc] of documents.entries()) {

      let buffer = ''
      await this.s.embed(
        doc,
        "llama2",
        (response: string) => { buffer += response },
        () => { buffer = '' })

      const embedding = buffer as any
      debugger

      collection.push({
        id: i.toString(),
        embedding,
        document: doc,
      })
    }

    // Example prompt
    const prompt = "What animals are llamas related to?"

    // Generate an embedding for the prompt
    let buffer2 = ''
    await this.s.generate(
      prompt,
      "llama2",
      (response: string) => { buffer2 += response },
      () => { buffer2 = '' })

    const promptEmbedding = buffer2 as any
    debugger
    // Find the most relevant document
    let closestDoc = ''
    let minDistance = Infinity

    for (const item of collection) {
      const distance = cosineSimilarity(promptEmbedding, item.embedding)
      if (distance < minDistance) {
        minDistance = distance
        closestDoc = item.document
      }
    }

    let buffer = ''
    await this.s.generate(
      `Using this data: ${closestDoc}. Respond to this prompt: ${prompt}`,
      "llama2",
      (response: string) => { buffer += response },
      () => { buffer = '' })


    console.log(buffer)
  }
}

// Utility function to calculate cosine similarity
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0)
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))
  return dotProduct / (magnitudeA * magnitudeB)
}
