import { Response } from 'express'
import fs from 'fs-extra'
import path from 'path'
import { inject, injectable } from 'tsyringe'

@injectable()
export class FileUploadState {
  constructor(
    public filename: string,
    public chunkIndex: number,
    public totalChunks: number,
    public chunkBufferPath: string,
    public complete: boolean,
    public userFilePath: string,
    public userFolder: string,
  ) { }
}

@injectable()
export class UploadedFileHelper {
  constructor(
    public state: FileUploadState,
    @inject('current-response') private res: Response,
  ) { }

  async save() {
    const { complete, totalChunks, chunkBufferPath: destination, userFilePath } = this.state
    if (complete) {
      console.log('All chunks received. Reassembling file...')

      const writeStream = fs.createWriteStream(userFilePath)

      for (let i = 0; i < totalChunks; i++) {
        const chunkPath = path.join(destination, `${i}.chunk`)
        if (fs.existsSync(chunkPath)) {
          const data = await fs.readFile(chunkPath)
          writeStream.write(data)
          fs.unlinkSync(chunkPath) // Delete chunk after appending
        } else {
          this.res.status(400).send({ message: `Missing chunk ${i}` })
          return
        }
      }

      writeStream.end()
      fs.rmdirSync(destination) // Delete chunk after appending

      return
    }
  }
  isComplete = () => this.state.complete
  public get fileName(): string {
    return this.state.filename
  }
  public get chunkIndex(): number {
    return this.state.chunkIndex
  }
  public get userFilePath(): string {
    return this.state.userFilePath
  }
  public get userFolder(): string {
    return this.state.userFolder
  }

}

