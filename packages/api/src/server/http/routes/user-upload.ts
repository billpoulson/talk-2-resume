import { IExpressRouteFactory } from '@talk2resume/common'
import express from 'express'
import { DependencyContainer, injectable } from 'tsyringe'
import { createRequestScopedHandler } from '../../../ioc/scopes/request.scope'
import { ChunkedUploadHandler } from '../chunked-upload-handler'
import { UploadedFileHelper } from '../uploaded-file-helper'



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
        const upload = scope.resolve(UploadedFileHelper)
        if (upload.isComplete()) {
          // Check if all chunks are received
          // chunks are staged in user isolated storage space
          await upload.save()
            .then(x => {
              console.log(`File ${upload.fileName} successfully reassembled at ${upload.userFilePath}`)
              res.status(200)
                .send({
                  message: 'Upload complete',
                  filePath: upload.userFilePath,
                  folder: upload.userFolder
                })
            })

        } else {
          res.status(200)
            .send({
              message: `Chunk ${upload.chunkIndex} uploaded successfully`,
            })
        }
        return
      })
    )

    return router
  }
}


