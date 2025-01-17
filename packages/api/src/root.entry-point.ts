import { OllamaServiceSettings } from '@talk2resume/common'
import { Ollama } from 'ollama'
import { DependencyContainer, inject, singleton } from 'tsyringe'
import { SCOPED_CONTAINER$$ } from './ioc/injection-tokens'
import { ExpressServerContainer } from './server/http/express-server-container'

@singleton()
export class RootEntryPoint {
  constructor(
    @inject(SCOPED_CONTAINER$$) public scope: DependencyContainer,
    private expressServer: ExpressServerContainer,
  ) {
    console.info(this.constructor.name)
  }

  public async bootstrap() {
    console.log(`bootstrap application`)
    
    const ollama = this.scope.resolve(Ollama)
    const settings = this.scope.resolve(OllamaServiceSettings)
    
    console.log(`checking for required models`)
    console.log(`pulling ${settings.completionModel}`)
    await ollama.pull({
      model: settings.completionModel
    }).then(progress => {
      console.log(`finished pulling ${settings.completionModel}`)
      console.log(progress)
    })
    console.log(`pulling ${settings.embeddingModel}`)
    await ollama.pull({
      model: settings.embeddingModel
    }).then(progress => {
      console.log(`finished pulling ${settings.embeddingModel}`)
      console.log(progress)
    })
    console.log(`models ready`)

    await this.expressServer.init()// setup http and websocket server
  }
}
