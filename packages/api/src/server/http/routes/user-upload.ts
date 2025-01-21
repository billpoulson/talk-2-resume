import { IExpressRouteFactory, newUUID } from '@talk2resume/common'
import { AppTreeNodeData } from '@talk2resume/types'
import express from 'express'
import { readdir } from 'fs/promises'
import { DependencyContainer, injectable } from 'tsyringe'
import { UserFileRepository } from '../../../db/mongodb/repo/hero.repo'
import { createRequestScopedHandler } from '../../../ioc/scopes/request.scope'
import { ChunkedUploadHandler } from '../chunked-upload-handler'
import { UploadedFileHelper, UserFileStorageSettings } from '../uploaded-file-helper'

export const dataMap = new Map<string, AppTreeNodeData>([
  ['1', {
    key: '1',
    text: newUUID(),
    type: 'folder',
  }],
  ['2', {
    key: '2',
    text: newUUID(),
    type: 'folder',
  }],
  ['3', {
    key: '3',
    parentKey: '1',
    text: newUUID(),
    type: 'file',
  }],
  ['4', {
    key: '4',
    parentKey: '2',
    text: newUUID(),
    type: 'folder',
  }],
  ['5', {
    key: '5',
    parentKey: '4',
    text: newUUID(),
    type: 'file',
  }],
  ['6', {
    key: '6',
    parentKey: '4',
    text: newUUID(),
    type: 'file',
  }],
])


@injectable()
export class UserFilesService {
  constructor(
    private settings: UserFileStorageSettings,
    private userFileRepo: UserFileRepository
  ) { }

  addFile() {
    this.userFileRepo.create({
      
    })
  }
  async listFiles() {
    try {
      const aa = await readdir(this.settings.userPath)
      return aa
    }
    catch (err) {
      console.error('An error occurred: ', err)
    }
    return null
  }
}

@injectable()
export class UserUploadControllerRouteFactory implements IExpressRouteFactory {
  create(
    scope: DependencyContainer
  ) {

    const chunkeddUploadHandler = new ChunkedUploadHandler()
    const requestScopedAction = createRequestScopedHandler(scope, (scope, req, res) => scope)

    const router = express.Router()

    router.get('/list/:folder?',
      requestScopedAction<{ folder: string }>(async (scope, req, res, params, body) => {
        const action = scope.resolve(UserFilesService)
        const folder = params.get('folder')
        const asd = await action.listFiles()
        const result = Array.from(dataMap.entries())
          .filter(([, x]) => x.parentKey === folder).map(([, x]) => x)

        res.status(200)
          .send(result)
      })
    )

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


