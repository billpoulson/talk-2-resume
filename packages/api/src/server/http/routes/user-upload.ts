import { IExpressRouteFactory, newUUID } from '@talk2resume/common'
import { AppTreeNodeData } from '@talk2resume/types'
import express from 'express'
import { readdir } from 'fs/promises'
import { DependencyContainer, injectable } from 'tsyringe'
import { UserFileEntity, UserFileRepository } from '../../../db/mongodb/repo/hero.repo'
import { createRequestScopedHandler } from '../../../ioc/scopes/request.scope'
import { ChunkedUploadHandler } from '../chunked-upload-handler'
import { UploadedFileHelper, UserFileStorageSettings } from '../uploaded-file-helper'

export const dataMap = new Map<string, AppTreeNodeData>([
  ['1', {
    _id: '1',
    text: newUUID(),
    type: 'folder',
  }],
  ['2', {
    _id: '2',
    text: newUUID(),
    type: 'folder',
  }],
  ['3', {
    _id: '3',
    parentKey: '1',
    text: newUUID(),
    type: 'file',
  }],
  ['4', {
    _id: '4',
    parentKey: '2',
    text: newUUID(),
    type: 'folder',
  }],
  ['5', {
    _id: '5',
    parentKey: '4',
    text: newUUID(),
    type: 'file',
  }],
  ['6', {
    _id: '6',
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

  addFile(entity: UserFileEntity) { return this.userFileRepo.create(entity) }
  async listFiles(folder?: string) {
    return this.userFileRepo.find({
      parentKey: folder,
      userPath: this.settings.userStorageKey
    })
  }

  async listFiles2() {
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
        const dbFiles = await action.listFiles(folder)
        const mockFiles = []

        res.status(200)
          .send([...dbFiles, ...mockFiles])
      })
    )

    router.post('/upload', chunkeddUploadHandler.create(),
      requestScopedAction<{}>(async (scope, req, res, params, body) => {
        const upload = scope.resolve(UploadedFileHelper)
        const action = scope.resolve(UserFilesService)
        const { userStorageKey: userPath } = scope.resolve(UserFileStorageSettings)

        if (upload.isComplete()) {
          // Check if all chunks are received
          // chunks are staged in user isolated storage space
          await upload.save()
            .then(async x => {
              await action.addFile({
                path: upload.userFilePath,
                text: upload.fileName,
                type: 'file',
                userPath,
              })
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


