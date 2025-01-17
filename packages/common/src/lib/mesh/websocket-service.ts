import { Observable } from 'rxjs'
import { newUUID } from '../uuid'
import { WebsocketFacade } from './websocket.facade'

export class WebsocketService {
  static createProvider(socket: WebsocketFacade) { 
    return  { useValue: WebsocketService.createFromInstance(socket), }
  }
  static createFromInstance(socket: WebsocketFacade) { 
    return new WebsocketService().useWebSocket(socket)
  }
  private ws!: WebSocket
  useWebSocket(socket: WebsocketFacade): WebsocketService {
    this.ws = socket as WebSocket
    return this
  }
  connect(url: string): Observable<any> {
    return new Observable((observer) => {
      // Create a WebSocket connection
      this.ws = new WebSocket(url)

      // Handle incoming messages
      this.ws.onmessage = (event) => {
        observer.next(JSON.parse(event.data))
      }

      // Handle connection close
      this.ws.onclose = () => {
        observer.complete()
      }

      // Handle errors
      this.ws.onerror = (error) => {
        observer.error(error)
      }

      // Cleanup on unsubscribe
      return () => {
        this.ws.close()
      }
    })
  }

  disconnect() {
    this.ws.close(1000, 'user disconnected')
  }

  sendMessage(message: any): void {
    message.uuid = newUUID()
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log(`sending message ${message.type}`)
      this.ws.send(JSON.stringify(message))
    } else {
      console.error('WebSocket is not connected')
    }
  }

}
