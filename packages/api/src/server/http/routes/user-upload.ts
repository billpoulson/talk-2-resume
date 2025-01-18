import { IExpressRouteFactory } from '@talk2resume/common'
import { UserInfoObject } from '@talk2resume/types'
import express from 'express'
import fs from 'fs-extra'
import path from 'path'
import { DependencyContainer, injectable } from 'tsyringe'
import { createRequestScopedHandler } from '../../../ioc/scopes/request.scope'
import { ChunkedUploadHandler } from '../chunked-upload-heandler'

@injectable()
export class UserUploadControllerRouteFactory implements IExpressRouteFactory {

  create(
    scope: DependencyContainer
  ) {
    const chunkeddUploadHandler = new ChunkedUploadHandler()
    const requestScopedAction = createRequestScopedHandler(scope, (scope, req, res) => scope)
    const router = express.Router()


    router.post('/upload', chunkeddUploadHandler.create(),
      requestScopedAction<{}>(async (scope, req, res, params, body) => {
        const { chunkIndex, totalChunks, file } = req.body
        const { filename } = file
        const { userFileBufferKey } = req as any
        const encodedFileName = btoa(filename)

        const TEMP_UPLOAD_DIR = `store/${userFileBufferKey}/${encodedFileName}`

        console.log(`Received chunk ${+chunkIndex + 1} of ${totalChunks} for file ${filename}`)

        // Check if all chunks are received
        if (Number(chunkIndex) + 1 === Number(totalChunks)) {
          const { email } = scope.resolve(UserInfoObject)
          const userPath = btoa(email)
          const USER_PATH = `store/${userPath}/${filename}`
          console.log('All chunks received. Reassembling file...')

          // const finalPath = path.join(TEMP_UPLOAD_DIR, filename)
          const writeStream = fs.createWriteStream(USER_PATH)

          for (let i = 0; i < totalChunks; i++) {
            const chunkPath = path.join(TEMP_UPLOAD_DIR, `${i}.chunk`)
            if (fs.existsSync(chunkPath)) {
              const data = await fs.readFile(chunkPath)
              writeStream.write(data)
              fs.unlinkSync(chunkPath) // Delete chunk after appending
            } else {
              res.status(400).send({ message: `Missing chunk ${i}` })
              return
            }
          }

          writeStream.end()
          fs.rmdirSync(TEMP_UPLOAD_DIR) // Delete chunk after appending
          
          console.log(`File ${filename} successfully reassembled at ${USER_PATH}`)
          res.status(200).send({ message: 'Upload complete', filePath: USER_PATH })
          return
        }

        res.status(200).send({ message: `Chunk ${chunkIndex} uploaded successfully` })
      })
    )

    return router
  }
}


