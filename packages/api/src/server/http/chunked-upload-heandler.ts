import { newUUID } from '@talk2resume/common'
import Busboy from 'busboy'
import { NextFunction, Request, Response } from 'express'
import fs from 'fs-extra'
import path from 'path'



export class ChunkedUploadHandler {
  constructor(
    private storePath: string = "store/"
  ) { }


  create() {
    return (req: Request, res: Response, next: NextFunction) => {
      const busboy = Busboy({ headers: req.headers })

      busboy.on('field', (fieldname, value) => {
        req.body[fieldname] = value // Save regular form fields
      })

      busboy.on('file', (fieldname, file, field, encoding, mimetype) => {

        const uploadTempPath = path.join(this.storePath, 'temp')
        const chunkFileName = `${newUUID()}.chunk`
        const chunkTemp = path.join(uploadTempPath, chunkFileName)

        // Check if directory exists
        if (!fs.existsSync(uploadTempPath)) {
          // If not, then create the directory
          fs.mkdirSync(uploadTempPath, { recursive: true })
        }

        const { filename } = field
        const { userFileBufferKey: userHash } = req as any
        file.pipe(fs.createWriteStream(chunkTemp)) // Pipe the file stream to write stream


        file.on('end', () => {
          const { chunkIndex } = req.body
          const chunkBufferPath = path.join(this.storePath, userHash, btoa(filename))
          const chunkPath = path.join(chunkBufferPath, `${chunkIndex}.chunk`)

          if (!fs.existsSync(chunkBufferPath)) {
            fs.mkdirSync(chunkBufferPath, { recursive: true })
          }

          fs.rename(chunkTemp, chunkPath)

          req.body[fieldname] = {
            filename,
            encoding,
            mimetype,
            tempfile: chunkTemp
          }
        })
      })

      busboy.on('finish', () => {
        next() // Move control to the next middleware when parsing is complete
      })

      busboy.on('error', (error) => {
        next(error) // Pass errors to Express
      })

      req.pipe(busboy) // Pipe the request stream into Busboy
    }
  }
}
